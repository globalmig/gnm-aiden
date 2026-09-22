"use client";

import { PRODUCT_TYPE_OPTIONS, type GiftKey, type GiftRange, type GiftSpeedTier, type ProductType } from "@/datas/internetPricing";

type GiftTable = Partial<Record<GiftKey, GiftRange>>;

const SPEED_TIER_OPTIONS: { value: GiftSpeedTier; label: string }[] = [
    { value: "500_1000", label: "500Mbps / 1Gbps" },
    { value: "100", label: "100Mbps" },
];

interface InternetGiftRangeEditorProps {
    giftTable: GiftTable;
    usimExtraGift: GiftRange;
    onGiftTableChange: (giftTable: GiftTable) => void;
    onUsimExtraGiftChange: (range: GiftRange) => void;
}

export default function InternetGiftRangeEditor({
    giftTable,
    usimExtraGift,
    onGiftTableChange,
    onUsimExtraGiftChange,
}: InternetGiftRangeEditorProps) {
    const updateRange = (key: GiftKey, field: keyof GiftRange, value: string) => {
        const current = giftTable[key] ?? { min: 0, max: 0 };
        onGiftTableChange({ ...giftTable, [key]: { ...current, [field]: Number(value) || 0 } });
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-3 pc:grid-cols-2">
                {PRODUCT_TYPE_OPTIONS.map((productOption: { value: ProductType; label: string }) =>
                    SPEED_TIER_OPTIONS.map((tierOption) => {
                        const key: GiftKey = `${productOption.value}|${tierOption.value}`;
                        const range = giftTable[key] ?? { min: 0, max: 0 };
                        return (
                            <div key={key} className="flex flex-col gap-2 rounded-lg border border-black/10 p-4">
                                <p className="text-sm font-bold text-title">
                                    {productOption.label} · {tierOption.label}
                                </p>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={range.min}
                                        onChange={(e) => updateRange(key, "min", e.target.value)}
                                        className="form-input"
                                        placeholder="최소 (만원)"
                                    />
                                    <span className="text-muted">~</span>
                                    <input
                                        type="number"
                                        value={range.max}
                                        onChange={(e) => updateRange(key, "max", e.target.value)}
                                        className="form-input"
                                        placeholder="최대 (만원)"
                                    />
                                    <span className="shrink-0 text-sm text-muted">만원</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="flex flex-col gap-2 rounded-lg border border-black/10 p-4">
                <p className="text-sm font-bold text-title">유심 결합개통 시 추가 사은품</p>
                <p className="text-xs text-muted">요금제에 따라 상이 (위 기본 사은품에 더해지는 범위)</p>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        value={usimExtraGift.min}
                        onChange={(e) => onUsimExtraGiftChange({ ...usimExtraGift, min: Number(e.target.value) || 0 })}
                        className="form-input"
                        placeholder="최소 (만원)"
                    />
                    <span className="text-muted">~</span>
                    <input
                        type="number"
                        value={usimExtraGift.max}
                        onChange={(e) => onUsimExtraGiftChange({ ...usimExtraGift, max: Number(e.target.value) || 0 })}
                        className="form-input"
                        placeholder="최대 (만원)"
                    />
                    <span className="shrink-0 text-sm text-muted">만원</span>
                </div>
            </div>
        </div>
    );
}
