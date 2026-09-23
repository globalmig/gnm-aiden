"use client";

import { useState } from "react";
import { formatDate } from "@/lib/format";
import { useUpdate } from "@/hooks/useUpdate";
import type { Inquiry } from "@/types/inquiry";
import Toast from "@/components/ui/Toast";

const STATUS_OPTIONS: Inquiry["status"][] = ["대기", "답변완료"];

type AgreementKey = "bundle_discount_opt_in" | "agree_collection" | "agree_third_party" | "agree_age";

const AGREEMENT_ITEMS: { key: AgreementKey; label: string }[] = [
    { key: "bundle_discount_opt_in", label: "결합할인 안내 동의" },
    { key: "agree_collection", label: "개인정보 수집·이용 동의" },
    { key: "agree_third_party", label: "제3자 제공 동의" },
    { key: "agree_age", label: "만 14세 이상 확인" },
];

interface LandingInquiryDetailProps {
    inquiry: Inquiry;
    onChange: (inquiry: Inquiry) => void;
}

// 랜딩페이지 리드는 답변/댓글 개념이 없어 상태를 관리자가 직접 전환한다.
export default function LandingInquiryDetail({ inquiry, onChange }: LandingInquiryDetailProps) {
    const [vaild, setVaild] = useState<string | null>(null);
    const { update, loading } = useUpdate<{ status: Inquiry["status"] }>("/api/inquiries");

    const handleStatusChange = async (status: Inquiry["status"]) => {
        if (status === inquiry.status || loading) return;
        const result = await update(inquiry.id, { status });
        if (result?.data) {
            onChange(result.data);
        } else {
            setVaild("상태 변경에 실패했습니다.");
        }
    };

    return (
        <div className="space-y-4">
            <div className="card p-6 md:p-8">
                <p className="text-sm text-muted">
                    랜딩 · {inquiry.name} · {inquiry.phone} · {formatDate(inquiry.created_at)}
                </p>
                <h1 className="mt-2 text-lg font-bold text-title">{inquiry.title || "제목 없음"}</h1>
                <p className="mt-4 whitespace-pre-line text-base text-body">{inquiry.content}</p>
            </div>

            <div className="card p-6 md:p-8">
                <p className="text-base font-semibold text-title">랜딩 접수 정보</p>
                <dl className="mt-4 grid grid-cols-1 gap-3 pc:grid-cols-2">
                    <div className="flex items-center justify-between rounded-lg bg-surface px-4 py-3">
                        <dt className="text-sm text-muted">관심 카테고리</dt>
                        <dd className="text-sm font-medium text-title">{inquiry.category || "-"}</dd>
                    </div>
                    {AGREEMENT_ITEMS.map(({ key, label }) => (
                        <div key={key} className="flex items-center justify-between rounded-lg bg-surface px-4 py-3">
                            <dt className="text-sm text-muted">{label}</dt>
                            <dd className={`text-sm font-semibold ${inquiry[key] ? "text-primary" : "text-muted"}`}>
                                {inquiry[key] ? "동의" : "미동의"}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>

            <div className="card p-6 md:p-8">
                <p className="text-base font-semibold text-title">처리 상태</p>
                <p className="mt-1 text-sm text-muted">
                    랜딩 문의는 답변 등록 없이 상태를 직접 변경합니다.
                </p>
                <div className="mt-4 flex gap-2">
                    {STATUS_OPTIONS.map((status) => (
                        <button
                            key={status}
                            type="button"
                            disabled={loading}
                            onClick={() => handleStatusChange(status)}
                            className={
                                inquiry.status === status
                                    ? "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
                                    : "rounded-full border border-table-border px-4 py-2 text-sm text-muted hover:text-primary disabled:opacity-50"
                            }
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <Toast vaild={vaild} setVaild={setVaild} />
        </div>
    );
}
