"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import InquiryBoard, { type InquiryBoardItem } from "@/components/board/InquiryBoard";
import Pagination from "@/components/ui/Pagination";
import CategoryBanner from "@/components/common/CategoryBanner";
import { usePagination } from "@/hooks/usePagination";
import type { Inquiry, InquiryReply } from "@/types/inquiry";

const ITEMS_PER_PAGE = 10;

type PublicInquiry = Pick<Inquiry, "id" | "title" | "name" | "is_secret" | "status" | "created_at"> & {
    replies: InquiryReply[];
};

export default function InquiryListPage() {
    const [inquiries, setInquiries] = useState<PublicInquiry[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const fetchInquiries = useCallback(async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const response = await fetch("/api/inquiries/public");
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

    const items: InquiryBoardItem[] = useMemo(
        () =>
            (inquiries ?? []).map((inquiry) => ({
                id: inquiry.id,
                title: inquiry.title || "제목 없음",
                author: inquiry.name,
                createdAt: inquiry.created_at,
                commentCount: inquiry.replies.length,
                isSecret: inquiry.is_secret,
            })),
        [inquiries]
    );

    const { currentItems, totalCount, onPageChange } = usePagination(items, ITEMS_PER_PAGE);

    return (
        <>
            <CategoryBanner title="질문 & 답변" />
            <section>
                <div>
                    <div className="flex justify-end">
                        <Link href="/inquiry/write" className="btn-primary px-6 py-2.5 text-base">
                            글쓰기
                        </Link>
                    </div>

                    <p className="mt-6 text-base text-body">
                        <span className="text-black">문의</span> 총 <span className="font-bold text-primary">{totalCount}</span>건
                    </p>

                    <div className="mt-3">
                        {isLoading ? (
                            <p className="py-16 text-center text-base text-muted">불러오는 중...</p>
                        ) : isError ? (
                            <p className="py-16 text-center text-base text-muted">{/* 목록을 불러오지 못했습니다. text-red-400 */}
                                        질문&답변 목록입니다.</p>
                        ) : (
                            <InquiryBoard items={currentItems} />
                        )}
                    </div>

                    {totalCount > 0 && (
                        <Pagination
                            totalCount={totalCount}
                            itemsPerPage={ITEMS_PER_PAGE}
                            onPageChange={onPageChange}
                        />
                    )}
                </div>
            </section>
        </>
    );
}
