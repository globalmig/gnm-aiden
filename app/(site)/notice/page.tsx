"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import NoticeBoard, { type NoticeBoardItem } from "@/components/board/NoticeBoard";
import Pagination from "@/components/ui/Pagination";
import CategoryBanner from "@/components/common/CategoryBanner";
import type { Notice } from "@/types/notice";

const ITEMS_PER_PAGE = 10;

export default function NoticeListPage() {
    const [notices, setNotices] = useState<Notice[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [page, setPage] = useState(1);

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

    const items: NoticeBoardItem[] = useMemo(
        () =>
            (notices ?? []).map((notice) => ({
                id: notice.id,
                title: notice.title,
                createdAt: notice.created_at,
                isPinned: notice.is_pinned,
            })),
        [notices]
    );

    const pageItems = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return items.slice(start, start + ITEMS_PER_PAGE);
    }, [items, page]);

    return (
        <>
            <CategoryBanner title="공지사항" />
            <section>
                <div>
                    <p className="text-base text-body">
                        <span className="text-black">공지</span> 총{" "}
                        <span className="font-bold text-primary">{items.length}</span>건
                    </p>

                    <div className="mt-3">
                        {isLoading && <p className="py-16 text-center text-base text-muted">불러오는 중...</p>}
                        {!isLoading && isError && (
                            <p className="py-16 text-center text-base text-red-400">
                                공지사항을 불러오지 못했습니다.
                            </p>
                        )}
                        {!isLoading && !isError && <NoticeBoard items={pageItems} />}
                    </div>

                    {!isLoading && !isError && items.length > 0 && (
                        <Pagination totalCount={items.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} />
                    )}
                </div>
            </section>
        </>
    );
}
