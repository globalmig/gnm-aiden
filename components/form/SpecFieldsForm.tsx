"use client";

import type { CategoryDef } from "@/datas/productCategories";
import FormRow from "./FormRow";

interface SpecFieldsFormProps {
    category: CategoryDef;
    specs: Record<string, string>;
    onChange: (specs: Record<string, string>) => void;
    /** specSections가 비어 있는 카테고리(스키마 미정의)를 위한 raw JSON 폴백 입력 */
    fallbackJsonText: string;
    onFallbackJsonChange: (text: string) => void;
    /** 구조화 스펙 필드별 검증 에러 메시지 (key: field.key) */
    errors?: Record<string, string>;
    /** raw JSON 폴백 입력의 검증 에러 메시지 */
    fallbackError?: string;
}

export default function SpecFieldsForm({
    category,
    specs,
    onChange,
    fallbackJsonText,
    onFallbackJsonChange,
    errors = {},
    fallbackError,
}: SpecFieldsFormProps) {
    if (category.specSections.length === 0) {
        return (
            <div className="flex flex-col gap-1.5">
                <label className="form-label">상세 스펙 (JSON)</label>
                <p className="text-xs text-muted">
                    &quot;{category.label}&quot; 카테고리는 아직 구조화된 스펙 항목이 정의되지 않아 JSON으로 직접 입력합니다.
                </p>
                <textarea
                    value={fallbackJsonText}
                    onChange={(e) => onFallbackJsonChange(e.target.value)}
                    rows={5}
                    placeholder={'{ "speed": "500M", "resolution": "4K" }'}
                    className="form-input font-mono text-sm"
                />
                {fallbackError && <p className="text-sm text-red-500">{fallbackError}</p>}
            </div>
        );
    }

    const setField = (key: string, value: string) => {
        onChange({ ...specs, [key]: value });
    };

    return (
        <div className="flex flex-col gap-6">
            {category.specSections.map((section) => {
                const isOptionalSection = section.title === "편의기능" || section.title.startsWith("분류");
                return (
                <div key={section.title} className="flex flex-col gap-3">
                    <p className="text-sm font-bold text-title">{section.title}</p>
                    <div className="overflow-hidden rounded-xl border border-gray-100">
                        {section.fields.map((field) => (
                            <FormRow key={field.key} label={field.label} required={!isOptionalSection}>
                                <div className="flex w-full flex-col gap-1">
                                    {field.type === "select" ? (
                                        <select
                                            value={specs[field.key] ?? ""}
                                            onChange={(e) => setField(field.key, e.target.value)}
                                            className="form-input"
                                        >
                                            <option value="">선택 안 함</option>
                                            {field.options?.map((option) => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            value={specs[field.key] ?? ""}
                                            onChange={(e) => setField(field.key, e.target.value)}
                                            placeholder={field.placeholder}
                                            className="form-input"
                                        />
                                    )}
                                    {errors[field.key] && <p className="text-sm text-red-500">{errors[field.key]}</p>}
                                </div>
                            </FormRow>
                        ))}
                    </div>
                </div>
                );
            })}
        </div>
    );
}
