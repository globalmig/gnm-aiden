"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QuillEditor from "@/components/board/QuillEditor";
import { useDelete } from "@/hooks/useDelete";
import type { Notice } from "@/types/notice";

export default function AdminNoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [notice, setNotice] = useState<Notice | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const fetchNotice = useCallback(() => {
        setIsLoading(true);
        setIsError(false);
        return fetch(`/api/notices/${id}`)
            .then((res) => res.json())
            .then((result) => {
                if (!result.data) throw new Error();
                setNotice(result.data);
            })
            .catch(() => setIsError(true))
            .finally(() => setIsLoading(false));
    }, [id]);

    useEffect(() => {
        fetchNotice();
    }, [fetchNotice]);

    const { remove, loading: deleteLoading } = useDelete("/api/notices", {
        onSuccess: () => router.push("/admin/notices"),
    });

    const handleDelete = () => {
        if (!confirm("이 공지사항을 삭제할까요?")) return;
        remove(id);
    };

    return (
        <div>
            <h1 className="mb-6 text-lg font-bold text-title">공지사항 상세</h1>

            {isLoading && <p className="text-base text-muted">불러오는 중...</p>}
            {!isLoading && (isError || !notice) && (
                <p className="text-base text-red-400">공지사항을 불러오지 못했습니다.</p>
            )}

            {!isLoading && notice && (
                <div className="card p-6 md:p-8 space-y-5">
                    <div className="flex items-center gap-2">
                        <input type="checkbox" checked={notice.is_pinned} disabled className="h-4 w-4" />
                        <span className="text-sm font-medium text-body">중요 공지로 등록 (목록 최상단에 고정)</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="form-label">제목</label>
                        <input type="text" value={notice.title} disabled readOnly className="form-input" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="form-label">내용</label>
                        <QuillEditor value={notice.content} onChange={() => {}} readOnly />
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                        <Link href="/admin/notices" className="admin-btn-ghost">
                            목록으로
                        </Link>
                        <Link href={`/admin/notices/${id}/edit`} className="admin-btn-ghost">
                            수정
                        </Link>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleteLoading}
                            className="admin-btn-primary"
                        >
                            {deleteLoading ? "삭제 중..." : "삭제"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
