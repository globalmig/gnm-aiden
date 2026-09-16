"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import { useDelete } from "@/hooks/useDelete";
import { useUpdate } from "@/hooks/useUpdate";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/components/ui/Pagination";
import { PencilIcon, TrashIcon } from "@/components/ui/Icons";
import type { Notice } from "@/types/notice";

const ITEMS_PER_PAGE = 10;

export default function AdminNoticesPage() {
    const [notices, setNotices] = useState<Notice[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [keywordInput, setKeywordInput] = useState("");
    const [keyword, setKeyword] = useState("");
    const [resetKey, setResetKey] = useState(0);

    const fetchNotices = useCallback(async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const response = await fetch("/api/notices");
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
            setNotices(result.data);
        } catch {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotices();
    }, [fetchNotices]);

    const { remove } = useDelete("/api/notices", { onSuccess: fetchNotices });
    const { update } = useUpdate("/api/notices");

    const handleDelete = (id: string) => {
        if (!confirm("이 공지사항을 삭제할까요?")) return;
        remove(id);
    };

    const handleTogglePin = async (notice: Notice) => {
        const nextPinned = !notice.is_pinned;

        setNotices((prev) =>
            prev ? prev.map((n) => (n.id === notice.id ? { ...n, is_pinned: nextPinned } : n)) : prev
        );

        const result = await update(notice.id, {
            title: notice.title,
            content: notice.content,
            is_pinned: nextPinned,
        });

        if (!result) {
            setNotices((prev) =>
                prev ? prev.map((n) => (n.id === notice.id ? { ...n, is_pinned: !nextPinned } : n)) : prev
            );
        }
    };

    const filteredNotices = useMemo(() => {
        if (!notices) return [];
        const trimmed = keyword.trim().toLowerCase();
        if (!trimmed) return notices;
        return notices.filter(
            (notice) =>
                notice.title.toLowerCase().includes(trimmed) ||
                notice.content.toLowerCase().includes(trimmed)
        );
    }, [notices, keyword]);

    const { currentItems, currentPage, totalCount, onPageChange } = usePagination(
        filteredNotices,
        ITEMS_PER_PAGE
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setKeyword(keywordInput);
        setResetKey((k) => k + 1);
    };

    const handleReset = () => {
        setKeywordInput("");
        setKeyword("");
        setResetKey((k) => k + 1);
    };

    return (
        <div className="space-y-4">
            <div className="card p-6 md:p-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-bold text-title">공지사항 관리</h1>
                    <Link href="/admin/notices/new" className="admin-btn-primary">
                        새 공지 작성
                    </Link>
                </div>

                <form onSubmit={handleSearch} className="mt-6 flex flex-wrap items-end gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-muted">제목 · 내용 검색</label>
                        <input
                            type="text"
                            value={keywordInput}
                            onChange={(e) => setKeywordInput(e.target.value)}
                            placeholder="검색어를 입력하세요"
                            className="form-input w-64"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button type="submit" className="admin-btn-primary">
                            조회
                        </button>
                        <button type="button" onClick={handleReset} className="admin-btn-ghost">
                            초기화
                        </button>
                    </div>
                </form>
            </div>

            <div className="card p-6 md:p-8">
                <p className="text-base text-body">
                    전체 <span className="font-bold text-primary">{totalCount}</span>건
                </p>

                <div className="mt-4 min-h-300 w-full overflow-x-auto">
                    <table className="w-full min-w-150 border-collapse text-left">
                        <thead>
                            <tr className="bg-table-head text-base text-title">
                                <th className="w-20 px-4 py-4 text-center">번호</th>
                                <th className="w-20 px-4 py-4 text-center">중요</th>
                                <th className="px-4 py-4">제목</th>
                                <th className="w-32 px-4 py-4 text-center">작성일</th>
                                <th className="w-40 px-4 py-4 text-center">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-16 text-center text-base text-muted">
                                        불러오는 중...
                                    </td>
                                </tr>
                            )}
                            {!isLoading && isError && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-16 text-center text-base text-red-400">
                                        목록을 불러오지 못했습니다.
                                    </td>
                                </tr>
                            )}
                            {!isLoading && !isError && currentItems.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-16 text-center text-base text-muted">
                                        {keyword ? "검색 결과가 없습니다." : "등록된 공지사항이 없습니다."}
                                    </td>
                                </tr>
                            )}
                            {!isLoading &&
                                !isError &&
                                currentItems.map((notice, i) => (
                                    <tr
                                        key={notice.id}
                                        className={`border-b border-table-border text-base text-body hover:bg-surface ${
                                            notice.is_pinned ? "bg-sky-light" : ""
                                        }`}
                                    >
                                        <td className="px-4 py-4 text-center text-muted">
                                            {totalCount - (currentPage - 1) * ITEMS_PER_PAGE - i}
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <button
                                                type="button"
                                                onClick={() => handleTogglePin(notice)}
                                                className={
                                                    notice.is_pinned
                                                        ? "rounded-full border border-primary/30 bg-white px-3 py-1 text-sm font-semibold text-primary"
                                                        : "rounded-full border border-table-border px-3 py-1 text-sm text-muted hover:text-primary"
                                                }
                                            >
                                                {notice.is_pinned ? "고정됨" : "고정"}
                                            </button>
                                        </td>
                                        <td className="max-w-0 px-4 py-4">
                                            <Link
                                                href={`/admin/notices/${notice.id}`}
                                                className="block truncate text-title hover:text-primary"
                                            >
                                                {notice.title}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-4 text-center text-muted">
                                            {formatDate(notice.created_at)}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    href={`/admin/notices/${notice.id}/edit`}
                                                    aria-label="수정"
                                                    title="수정"
                                                    className="admin-btn-icon"
                                                >
                                                    <PencilIcon />
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(notice.id)}
                                                    aria-label="삭제"
                                                    title="삭제"
                                                    className="admin-btn-icon-danger"
                                                >
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {totalCount > 0 && (
                    <Pagination
                        key={resetKey}
                        totalCount={totalCount}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={onPageChange}
                    />
                )}
            </div>
        </div>
    );
}
