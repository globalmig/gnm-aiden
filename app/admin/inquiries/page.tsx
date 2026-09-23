"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDate, isToday } from "@/lib/format";
import { authFetch } from "@/lib/apiFetch";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/components/ui/Pagination";
import type { Inquiry } from "@/types/inquiry";

const ITEMS_PER_PAGE = 10;

const STATUS_OPTIONS = ["전체", "대기", "답변완료"] as const;

type StatusOption = (typeof STATUS_OPTIONS)[number];

interface InquiryFilters {
    status: StatusOption;
    dateFrom: string;
    dateTo: string;
    keyword: string;
}

const EMPTY_FILTERS: InquiryFilters = { status: "전체", dateFrom: "", dateTo: "", keyword: "" };

export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [statusInput, setStatusInput] = useState<StatusOption>("전체");
    const [dateFromInput, setDateFromInput] = useState("");
    const [dateToInput, setDateToInput] = useState("");
    const [keywordInput, setKeywordInput] = useState("");

    const [filters, setFilters] = useState<InquiryFilters>(EMPTY_FILTERS);
    const [resetKey, setResetKey] = useState(0);

    const fetchInquiries = useCallback(async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const response = await authFetch("/api/inquiries");
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
            setInquiries(result.data);
        } catch {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInquiries();
    }, [fetchInquiries]);

    const filteredInquiries = useMemo(() => {
        if (!inquiries) return [];
        const trimmedKeyword = filters.keyword.trim().toLowerCase();
        const from = filters.dateFrom ? new Date(`${filters.dateFrom}T00:00:00`) : null;
        const to = filters.dateTo ? new Date(`${filters.dateTo}T23:59:59`) : null;

        return inquiries.filter((inquiry) => {
            if (filters.status !== "전체" && inquiry.status !== filters.status) return false;

            const createdAt = new Date(inquiry.created_at);
            if (from && createdAt < from) return false;
            if (to && createdAt > to) return false;

            if (trimmedKeyword) {
                const matchesName = inquiry.name.toLowerCase().includes(trimmedKeyword);
                const matchesPhone = inquiry.phone.toLowerCase().includes(trimmedKeyword);
                if (!matchesName && !matchesPhone) return false;
            }

            return true;
        });
    }, [inquiries, filters]);

    const { currentItems, currentPage, totalCount, onPageChange } = usePagination(
        filteredInquiries,
        ITEMS_PER_PAGE
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters({ status: statusInput, dateFrom: dateFromInput, dateTo: dateToInput, keyword: keywordInput });
        setResetKey((k) => k + 1);
    };

    const handleReset = () => {
        setStatusInput("전체");
        setDateFromInput("");
        setDateToInput("");
        setKeywordInput("");
        setFilters(EMPTY_FILTERS);
        setResetKey((k) => k + 1);
    };

    const isFiltered = JSON.stringify(filters) !== JSON.stringify(EMPTY_FILTERS);

    return (
        <div className="space-y-4">
            <div className="card p-6 md:p-8">
                <h1 className="text-lg font-bold text-title">문의 관리</h1>

                <form onSubmit={handleSearch} className="mt-6 flex flex-wrap items-end gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-muted">상태</label>
                        <select
                            value={statusInput}
                            onChange={(e) => setStatusInput(e.target.value as StatusOption)}
                            className="form-input w-32"
                        >
                            {STATUS_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-muted">접수일(부터)</label>
                        <input
                            type="date"
                            value={dateFromInput}
                            onChange={(e) => setDateFromInput(e.target.value)}
                            className="form-input w-44"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-muted">접수일(까지)</label>
                        <input
                            type="date"
                            value={dateToInput}
                            onChange={(e) => setDateToInput(e.target.value)}
                            className="form-input w-44"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-muted">이름/전화번호</label>
                        <input
                            type="text"
                            value={keywordInput}
                            onChange={(e) => setKeywordInput(e.target.value)}
                            placeholder="이름 또는 전화번호로 검색"
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
                                <th className="w-24 px-4 py-4 text-center">구분</th>
                                <th className="w-36 px-4 py-4 text-center">작성자</th>
                                <th className="px-4 py-4">제목</th>
                                <th className="w-36 px-4 py-4 text-center">연락처</th>
                                <th className="w-32 px-4 py-4 text-center">접수일</th>
                                <th className="w-28 px-4 py-4 text-center">상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-16 text-center text-base text-muted">
                                        불러오는 중...
                                    </td>
                                </tr>
                            )}
                            {!isLoading && isError && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-16 text-center text-base text-red-400">
                                        목록을 불러오지 못했습니다.
                                    </td>
                                </tr>
                            )}
                            {!isLoading && !isError && currentItems.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-16 text-center text-base text-muted">
                                        {isFiltered ? "조건에 맞는 문의가 없습니다." : "등록된 문의가 없습니다."}
                                    </td>
                                </tr>
                            )}
                            {!isLoading &&
                                !isError &&
                                currentItems.map((inquiry, i) => {
                                    // 관리자가 한 번 답변한 뒤 문의자가 댓글로 추가 문의를 남기면 상태가 다시 "대기"로
                                    // 바뀌는데, 신규 미답변 문의와 똑같이 보여서 놓치기 쉬우므로 별도 뱃지로 구분한다.
                                    const hasAdminReply = inquiry.replies.some((reply) => reply.author === "관리자");
                                    const lastReply = inquiry.replies[inquiry.replies.length - 1];
                                    const isFollowUp = hasAdminReply && !!lastReply && lastReply.author !== "관리자";

                                    return (
                                        <tr
                                            key={inquiry.id}
                                            className="border-b border-table-border text-base text-body hover:bg-surface"
                                        >
                                            <td className="px-4 py-4 text-center text-muted">
                                                {totalCount - (currentPage - 1) * ITEMS_PER_PAGE - i}
                                            </td>
                                            <td className="px-4 py-4 text-center text-muted">
                                                {inquiry.source === "landing" ? "랜딩" : "공식홈"}
                                            </td>
                                            <td className="px-4 py-4 text-center font-medium text-title">
                                                {inquiry.name}
                                            </td>
                                            <td className="max-w-0 px-4 py-4">
                                                <Link
                                                    href={`/admin/inquiries/${inquiry.id}`}
                                                    className="flex min-w-0 items-center gap-1.5 text-title hover:text-primary"
                                                >
                                                    <span className="truncate">{inquiry.title || inquiry.content}</span>
                                                    {(isToday(inquiry.created_at) || inquiry.status === "대기") && (
                                                        <Image
                                                            src="/icons/icon-new-contents.svg"
                                                            alt="신규 문의"
                                                            width={17}
                                                            height={17}
                                                            className="shrink-0"
                                                        />
                                                    )}
                                                    {isFollowUp && (
                                                        <span className="inline-flex shrink-0 items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-500">
                                                            추가 문의
                                                        </span>
                                                    )}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-4 text-center text-muted">{inquiry.phone}</td>
                                            <td className="px-4 py-4 text-center text-muted">
                                                {formatDate(inquiry.created_at)}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span
                                                    className={
                                                        inquiry.status === "답변완료"
                                                            ? "inline-flex rounded-full bg-sky-light px-3 py-1 text-xs font-semibold text-primary"
                                                            : "inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600"
                                                    }
                                                >
                                                    {inquiry.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
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
