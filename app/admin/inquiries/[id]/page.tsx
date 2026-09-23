"use client";

import { use, useCallback, useEffect, useState } from "react";
import { formatDate } from "@/lib/format";
import { authFetch } from "@/lib/apiFetch";
import { useUpdate } from "@/hooks/useUpdate";
import type { Inquiry } from "@/types/inquiry";
import CommentForm from "@/components/board/CommentForm";
import LandingInquiryDetail from "@/components/admin/LandingInquiryDetail";
import Toast from "@/components/ui/Toast";

export default function AdminInquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [vaild, setVaild] = useState<string | null>(null);

    const fetchInquiry = useCallback(() => {
        setIsLoading(true);
        return authFetch(`/api/inquiries/${id}`)
            .then((res) => res.json())
            .then((result) => setInquiry(result.data))
            .catch(() => setIsError(true))
            .finally(() => setIsLoading(false));
    }, [id]);

    useEffect(() => {
        fetchInquiry();
    }, [fetchInquiry]);

    const { update, loading: replyLoading } = useUpdate<{
        reply: { author: string; content: string };
        role: "admin";
    }>("/api/inquiries", { onSuccess: fetchInquiry });

    const handleReply = useCallback(
        async (content: string) => {
            const result = await update(id, { reply: { author: "관리자", content }, role: "admin" });
            if (!result) {
                setVaild("답변 등록에 실패했습니다.");
                return false;
            }
            return true;
        },
        [update, id]
    );

    if (isLoading) return <p className="text-base text-muted">불러오는 중...</p>;
    if (isError || !inquiry) return <p className="text-base text-red-400">문의를 불러오지 못했습니다.</p>;

    if (inquiry.source === "landing") {
        return <LandingInquiryDetail inquiry={inquiry} onChange={setInquiry} />;
    }

    return (
        <div className="space-y-4">
            <div className="card p-6 md:p-8">
                <p className="text-sm text-muted">
                    홈페이지 · {inquiry.name} · {inquiry.phone} · {formatDate(inquiry.created_at)}
                </p>
                <h1 className="mt-2 text-lg font-bold text-title">{inquiry.title || "제목 없음"}</h1>
                <p className="mt-4 whitespace-pre-line text-base text-body">{inquiry.content}</p>
            </div>

            {inquiry.replies.length > 0 && (
                <div className="card space-y-3 p-6 md:p-8">
                    <p className="text-base font-semibold text-title">답변 내역</p>
                    {inquiry.replies.map((reply, i) => {
                        const isAdminReply = reply.author === "관리자";
                        return (
                            <div
                                key={i}
                                className={`rounded-lg border p-4 ${
                                    isAdminReply ? "border-primary/15 bg-sky-light" : "border-table-border bg-white"
                                }`}
                            >
                                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
                                    <span className="font-medium text-title">{reply.author}</span>
                                    <span
                                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                            isAdminReply ? "bg-primary text-white" : "border border-black/10 bg-white text-body"
                                        }`}
                                    >
                                        {isAdminReply ? "관리자" : "문의자"}
                                    </span>
                                    <span>{formatDate(reply.created_at)}</span>
                                </p>
                                <p className="mt-1 whitespace-pre-line text-base text-body">{reply.content}</p>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="card p-6 md:p-8">
                <CommentForm
                    label="답변 작성"
                    placeholder="답변 내용을 입력해주세요."
                    submitLabel="답변 등록"
                    buttonClassName="admin-btn-primary"
                    multiline
                    loading={replyLoading}
                    onSubmit={handleReply}
                />
            </div>

            <Toast vaild={vaild} setVaild={setVaild} />
        </div>
    );
}
