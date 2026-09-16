"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import NoticeDetail from "@/components/board/NoticeDetail";
import type { Notice } from "@/types/notice";

export default function NoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [notice, setNotice] = useState<Notice | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setIsError(false);
        fetch(`/api/notices/${id}`)
            .then((res) => res.json())
            .then((result) => {
                if (!result.data) throw new Error();
                setNotice(result.data);
            })
            .catch(() => setIsError(true))
            .finally(() => setIsLoading(false));
    }, [id]);

    return (
        <>
            <section>
                <div>
                    <Link href="/notice" className="text-sm text-muted hover:text-primary">
                        ← 목록으로
                    </Link>

                    <div className="mt-6">
                        {isLoading && <p className="py-16 text-center text-base text-muted">불러오는 중...</p>}
                        {!isLoading && isError && (
                            <p className="py-16 text-center text-base text-red-400">
                                공지사항을 찾을 수 없습니다.
                            </p>
                        )}
                        {!isLoading && !isError && notice && (
                            <NoticeDetail
                                title={notice.title}
                                createdAt={notice.created_at}
                                content={notice.content}
                            />
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
