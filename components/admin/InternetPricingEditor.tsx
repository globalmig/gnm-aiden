"use client";

import { useState } from "react";
import {
    BUNDLE_TYPE_OPTIONS,
    COMPANY_OPTIONS,
    PRODUCT_TYPE_OPTIONS,
    SPEED_OPTIONS,
    type BundleType,
    type Company,
    type InternetPlan,
    type PlanKey,
    type ProductType,
    type Speed,
} from "@/datas/internetPricing";

type PlansMap = Partial<Record<PlanKey, InternetPlan[]>>;

function toPlanKey(company: Company, productType: ProductType, speed: Speed, bundleType: BundleType): PlanKey {
    return `${company}|${productType}|${speed}|${bundleType}`;
}

const EMPTY_PLAN: InternetPlan = { planName: "기본", composition: "", setTop: "", price: 0 };

interface InternetPricingEditorProps {
    plans: PlansMap;
    onChange: (plans: PlansMap) => void;
}

export default function InternetPricingEditor({ plans, onChange }: InternetPricingEditorProps) {
    const [company, setCompany] = useState<Company>(COMPANY_OPTIONS[0].value);

    const updateKey = (key: PlanKey, nextPlans: InternetPlan[] | null) => {
        const next = { ...plans };
        if (!nextPlans || nextPlans.length === 0) {
            delete next[key];
        } else {
            next[key] = nextPlans;
        }
        onChange(next);
    };

    const addCombo = (key: PlanKey) => updateKey(key, [{ ...EMPTY_PLAN }]);
    const addPlan = (key: PlanKey) => updateKey(key, [...(plans[key] ?? []), { ...EMPTY_PLAN }]);
    const removePlan = (key: PlanKey, index: number) => {
        const current = plans[key] ?? [];
        updateKey(key, current.filter((_, i) => i !== index));
    };
    const updatePlanField = (key: PlanKey, index: number, field: keyof InternetPlan, value: string) => {
        const current = plans[key] ?? [];
        const nextPlans = current.map((plan, i) =>
            i === index ? { ...plan, [field]: field === "price" ? Number(value) || 0 : value } : plan
        );
        updateKey(key, nextPlans);
    };

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-2">
                {COMPANY_OPTIONS.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => setCompany(option.value)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                            company === option.value
                                ? "border-primary bg-primary text-white"
                                : "border-black/10 bg-white text-body hover:border-primary/40"
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            <div className="overflow-x-auto">
                <div className="grid min-w-200 grid-cols-[140px_repeat(3,1fr)] gap-2">
                    <div />
                    {SPEED_OPTIONS.map((speedOption) => (
                        <div key={speedOption.value} className="text-center text-sm font-bold text-title">
                            {speedOption.label}
                        </div>
                    ))}

                    {PRODUCT_TYPE_OPTIONS.map((productOption) =>
                        BUNDLE_TYPE_OPTIONS.map((bundleOption) => (
                            <div key={`${productOption.value}-${bundleOption.value}`} className="contents">
                                <div className="flex flex-col justify-center rounded-lg bg-surface px-3 py-2 text-xs font-semibold text-title">
                                    <span>{productOption.label}</span>
                                    <span className="text-muted">{bundleOption.label}</span>
                                </div>
                                {SPEED_OPTIONS.map((speedOption) => {
                                    const key = toPlanKey(company, productOption.value, speedOption.value, bundleOption.value);
                                    const cellPlans = plans[key];

                                    return (
                                        <div key={key} className="rounded-lg border border-black/10 p-2">
                                            {!cellPlans || cellPlans.length === 0 ? (
                                                <button
                                                    type="button"
                                                    onClick={() => addCombo(key)}
                                                    className="flex h-full w-full items-center justify-center rounded-md py-4 text-xs text-muted hover:bg-surface"
                                                >
                                                    + 조합 추가
                                                </button>
                                            ) : (
                                                <div className="flex flex-col gap-2">
                                                    {cellPlans.map((plan, index) => (
                                                        <div key={index} className="flex flex-col gap-1 rounded-md bg-surface p-2">
                                                            <input
                                                                type="text"
                                                                value={plan.planName}
                                                                onChange={(e) => updatePlanField(key, index, "planName", e.target.value)}
                                                                placeholder="플랜명"
                                                                className="form-input px-2 py-1 text-xs"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={plan.composition}
                                                                onChange={(e) => updatePlanField(key, index, "composition", e.target.value)}
                                                                placeholder="구성"
                                                                className="form-input px-2 py-1 text-xs"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={plan.setTop ?? ""}
                                                                onChange={(e) => updatePlanField(key, index, "setTop", e.target.value)}
                                                                placeholder="셋탑 (선택)"
                                                                className="form-input px-2 py-1 text-xs"
                                                            />
                                                            <div className="flex items-center gap-1">
                                                                <input
                                                                    type="number"
                                                                    value={plan.price}
                                                                    onChange={(e) => updatePlanField(key, index, "price", e.target.value)}
                                                                    placeholder="가격"
                                                                    className="form-input px-2 py-1 text-xs font-bold"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removePlan(key, index)}
                                                                    aria-label="플랜 삭제"
                                                                    className="shrink-0 rounded p-1 text-red-400 hover:bg-red-50"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => addPlan(key)}
                                                        className="text-xs text-primary hover:underline"
                                                    >
                                                        + 플랜 추가
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
