"use client";

import { use, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CommentForm from "@/components/board/CommentForm";
import InquiryDetail, { type InquiryComment } from "@/components/board/InquiryDetail";
import Toast from "@/components/ui/Toast";
import { supabaseClient } from "@/lib/supabaseClient";
import { authFetch } from "@/lib/apiFetch";
import type { Inquiry } from "@/types/inquiry";

export default function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const [isUnlocked, setIsUnlocked] = useState(false);
    const [password, setPassword] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [replyLoading, setReplyLoading] = useState(false);
    const [vaild, setVaild] = useState<string | null>(null);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [deleting, setDeleting] = useState(false);

    // 관리자는 비밀글이어도 원본 내용을 그대로 받고, 그 외에는 비밀번호 확인 전까지
    // 내용/답변이 내려오지 않는 공개용 엔드포인트를 사용한다.
    // 세션 확인과 상세 조회를 순차로 묶어서, 두 요청이 따로 실행되며 서로의 결과를
    // 덮어쓰는 경합(늦게 끝난 공개 조회가 관리자용 전체 데이터를 지워버리는 문제)을 막는다.
    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        setIsError(false);

        supabaseClient.auth
            .getSession()
            .then(({ data }) => {
                const admin = !!data.session;
                if (cancelled) return null;
                setIsAdmin(admin);

                const url = admin ? `/api/inquiries/${id}` : `/api/inquiries/${id}/public`;
                return (admin ? authFetch(url) : fetch(url)).then((res) => res.json());
            })
            .then((result) => {
                if (cancelled || !result) return;
                if (!result.data) throw new Error();
                setInquiry(result.data);
            })
            .catch(() => {
                if (!cancelled) setIsError(true);
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [id]);

    const handleVerifyPassword = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (verifying || !password.trim()) return;

            try {
                setVerifying(true);
                const response = await fetch(`/api/inquiries/${id}/verify`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ password: password.trim() }),
                });
                const result = await response.json();

                if (!response.ok) {
                    setVaild(result.error || "비밀번호가 일치하지 않습니다.");
                    return;
                }

                setInquiry(result.data);
                setIsUnlocked(true);
            } catch {
                setVaild("비밀번호 확인에 실패했습니다.");
            } finally {
                setVerifying(false);
            }
        },
        [verifying, password, id]
    );

    // 관리자는 답변으로 등록하고, 비밀번호를 확인한 문의 고객은 추가 문의(댓글)로 등록한다.
    const handleSubmitComment = useCallback(
        async (content: string) => {
            if (!inquiry) return false;

            try {
                setReplyLoading(true);
                const response = await fetch(`/api/inquiries/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        reply: { author: isAdmin ? "관리자" : inquiry.name, content },
                        role: isAdmin ? "admin" : "customer",
                        password: isAdmin ? undefined : password.trim(),
                    }),
                });
                const result = await response.json();

                if (!response.ok) {
                    setVaild(result.error || "등록에 실패했습니다.");
                    return false;
                }

                setInquiry(result.data);
                return true;
            } catch {
                setVaild("등록에 실패했습니다.");
                return false;
            } finally {
                setReplyLoading(false);
            }
        },
        [id, inquiry, isAdmin, password]
    );

    // 비밀글 비밀번호를 다시 입력해야 삭제할 수 있다 (이미 확인한 비밀번호와 별개로 재입력을 요구한다).
    const handleDelete = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (deleting || !deletePassword.trim()) return;

            try {
                setDeleting(true);
                const response = await fetch(`/api/inquiries/${id}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ role: "customer", password: deletePassword.trim() }),
                });
                const result = await response.json().catch(() => null);

                if (!response.ok) {
                    setVaild(result?.error || "삭제에 실패했습니다.");
                    return;
                }

                router.push("/inquiry");
            } catch {
                setVaild("삭제에 실패했습니다.");
            } finally {
                setDeleting(false);
            }
        },
        [deleting, deletePassword, id, router]
    );

    if (isLoading) {
        return (
            <section>
                <div>
                    <p className="py-16 text-center text-base text-muted">불러오는 중...</p>
                </div>
            </section>
        );
    }

    if (isError || !inquiry) {
        return (
            <section>
                <div>
                    <p className="py-16 text-center text-base text-red-400">문의를 불러오지 못했습니다.</p>
                </div>
            </section>
        );
    }

    const canView = isAdmin || !inquiry.is_secret || isUnlocked;
    const canComment = isAdmin || !inquiry.is_secret || isUnlocked;
    const canDelete = !isAdmin && inquiry.is_secret && isUnlocked;

    const comments: InquiryComment[] = inquiry.replies.map((reply, i) => ({
        id: i,
        author: reply.author,
        createdAt: reply.created_at,
        content: reply.content,
    }));

    return (
        <>
            <section>
                <div>
                    <div className="flex items-center justify-between">
                        <Link href="/inquiry" className="text-sm text-muted hover:text-primary">
                            ← 목록으로
                        </Link>

                        {canDelete && (
                            showDeleteConfirm ? (
                                <form onSubmit={handleDelete} className="flex items-center gap-2">
                                    <input
                                        type="password"
                                        value={deletePassword}
                                        onChange={(e) => setDeletePassword(e.target.value)}
                                        placeholder="비밀번호 재입력"
                                        className="form-input w-40"
                                        autoFocus
                                    />
                                    <button type="submit" disabled={deleting} className="btn-ghost shrink-0">
                                        {deleting ? "삭제 중..." : "삭제 확인"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowDeleteConfirm(false);
                                            setDeletePassword("");
                                        }}
                                        className="text-sm text-muted hover:text-primary"
                                    >
                                        취소
                                    </button>
                                </form>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="text-sm text-muted hover:text-red-400"
                                >
                                    문의 삭제
                                </button>
                            )
                        )}
                    </div>

                    <div className="mt-6">
                        {canView ? (
                            <InquiryDetail
                                title={inquiry.title || "제목 없음"}
                                author={inquiry.name}
                                createdAt={inquiry.created_at}
                                content={inquiry.content}
                                comments={comments}
                                canWriteComment={canComment}
                                commentForm={
                                    <CommentForm
                                        placeholder={isAdmin ? "답변을 입력해주세요" : "추가로 문의하실 내용을 입력해주세요"}
                                        loading={replyLoading}
                                        onSubmit={handleSubmitComment}
                                    />
                                }
                            />
                        ) : (
                            <div className="flex w-full flex-col items-center gap-4 py-24">
                                <Image src="/icons/icon-lock.svg" alt="비밀글" width={22} height={26} />
                                <p className="text-base text-muted">비밀글입니다. 작성 시 등록한 비밀번호를 입력해주세요.</p>
                                <form onSubmit={handleVerifyPassword} className="flex gap-2">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="비밀번호"
                                        className="form-input w-48"
                                    />
                                    <button type="submit" disabled={verifying} className="btn-primary shrink-0">
                                        {verifying ? "확인 중..." : "확인"}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Toast vaild={vaild} setVaild={setVaild} />
        </>
    );
}
