"use client";

import { useCallback, useEffect, useState } from "react";
import Toast from "@/components/ui/Toast";
import InternetPricingEditor from "@/components/admin/InternetPricingEditor";
import InternetGiftRangeEditor from "@/components/admin/InternetGiftRangeEditor";
import { authFetch } from "@/lib/apiFetch";
import { DEFAULT_INTERNET_PRICING_CONFIG, type InternetPricingConfig } from "@/datas/internetPricing";

type Tab = "plans" | "gift";

export default function AdminInternetPricingPage() {
    const [config, setConfig] = useState<InternetPricingConfig>(DEFAULT_INTERNET_PRICING_CONFIG);
    const [isLoading, setIsLoading] = useState(true);
    const [tab, setTab] = useState<Tab>("plans");
    const [saving, setSaving] = useState(false);
    const [vaild, setVaild] = useState<string | null>(null);

    const fetchConfig = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/internet-pricing");
            const result = await response.json();
            if (response.ok && result.data) setConfig(result.data);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConfig();
    }, [fetchConfig]);

    const handleSave = async () => {
        if (saving) return;
        setSaving(true);
        try {
            const response = await authFetch("/api/internet-pricing", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(config),
            });
            const result = await response.json();
            setVaild(response.ok ? "저장되었습니다. 실제 인터넷 페이지에 바로 반영됩니다." : (result.error || "저장에 실패했습니다."));
        } catch {
            setVaild("저장 중 오류가 발생했습니다.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="card p-6 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-bold text-title">인터넷 요금 관리</h1>
                    <p className="mt-1 text-sm text-body">
                        통신사별 요금표와 사은품 범위를 수정하면 실제 /internet 페이지에 바로 반영됩니다.
                    </p>
                </div>
                <button type="button" onClick={handleSave} disabled={saving || isLoading} className="admin-btn-primary">
                    {saving ? "저장 중..." : "저장"}
                </button>
            </div>

            {isLoading ? (
                <p className="mt-6 text-base text-muted">불러오는 중...</p>
            ) : (
                <>
                    <div className="mt-6 flex gap-2 border-b border-gray-100">
                        <button
                            type="button"
                            onClick={() => setTab("plans")}
                            className={`px-4 py-2.5 text-sm font-semibold ${tab === "plans" ? "border-b-2 border-primary text-primary" : "text-muted"}`}
                        >
                            통신사별 요금표
                        </button>
                        <button
                            type="button"
                            onClick={() => setTab("gift")}
                            className={`px-4 py-2.5 text-sm font-semibold ${tab === "gift" ? "border-b-2 border-primary text-primary" : "text-muted"}`}
                        >
                            사은품
                        </button>
                    </div>

                    <div className="mt-6">
                        {tab === "plans" ? (
                            <InternetPricingEditor
                                plans={config.plans}
                                onChange={(plans) => setConfig((prev) => ({ ...prev, plans }))}
                            />
                        ) : (
                            <InternetGiftRangeEditor
                                giftTable={config.giftTable}
                                usimExtraGift={config.usimExtraGift}
                                onGiftTableChange={(giftTable) => setConfig((prev) => ({ ...prev, giftTable }))}
                                onUsimExtraGiftChange={(usimExtraGift) => setConfig((prev) => ({ ...prev, usimExtraGift }))}
                            />
                        )}
                    </div>
                </>
            )}

            <Toast vaild={vaild} setVaild={setVaild} />
        </div>
    );
}
