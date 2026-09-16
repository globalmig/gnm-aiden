"use client";

import { use, useEffect, useState } from "react";
import NoticeForm from "@/components/form/NoticeForm";
import type { Notice } from "@/types/notice";

export default function AdminNoticeEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [notice, setNotice] = useState<Notice | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        fetch(`/api/notices/${id}`)
            .then((res) => res.json())
            .then((result) => setNotice(result.data))
            .catch(() => setIsError(true))
            .finally(() => setIsLoading(false));
    }, [id]);

    return (
        <div>
            <h1 className="mb-6 text-lg font-bold text-title">공지사항 수정</h1>

            {isLoading && <p className="text-base text-muted">불러오는 중...</p>}
            {isError && <p className="text-base text-red-400">공지사항을 불러오지 못했습니다.</p>}
            {notice && (
                <NoticeForm
                    editId={id}
                    initialData={{ title: notice.title, content: notice.content, is_pinned: notice.is_pinned }}
                />
            )}
        </div>
    );
}
