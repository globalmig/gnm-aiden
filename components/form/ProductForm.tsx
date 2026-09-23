"use client";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Toast from "../ui/Toast";
import ImageDropUploader from "./ImageDropUploader";
import SpecFieldsForm from "./SpecFieldsForm";
import FormRow from "./FormRow";
import { useCreate } from "@/hooks/useCreate";
import { useUpdate } from "@/hooks/useUpdate";
import { buildProductFormSchema, type ProductFormValues } from "@/lib/schemas/product";
import type { CategoryDef } from "@/datas/productCategories";
import type { Product, ProductInput } from "@/types/product";

interface ProductFormOwnProps {
    category: CategoryDef;
    editId?: string;
    initialData?: Product;
}

function toTextarea(value: string[] | Record<string, unknown> | unknown[]) {
    if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
        return (value as string[]).join("\n");
    }
    return JSON.stringify(value, null, 2);
}

function toStructuredSpecs(specs: Record<string, unknown> | undefined): Record<string, string> {
    if (!specs) return {};
    return Object.fromEntries(Object.entries(specs).map(([key, value]) => [key, String(value ?? "")]));
}

export default function ProductForm({ category, editId, initialData }: ProductFormOwnProps) {
    const isEditMode = !!editId;
    const router = useRouter();
    const usesStructuredSpecs = category.specSections.length > 0;
    const [vaild, setVaild] = useState<string | null>(null);

    const productSchema = useMemo(() => buildProductFormSchema(category), [category]);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: initialData?.name ?? "",
            brand: initialData?.brand ?? "",
            price: initialData ? String(initialData.price) : "",
            discount_info: initialData?.discount_info ?? "",
            is_popular: initialData?.is_popular ?? false,
            popular_order: initialData?.popular_order?.toString() ?? "",
            images: initialData?.images ?? [],
            specs: toStructuredSpecs(initialData?.specs),
            specsJsonText: initialData ? toTextarea(initialData.specs) : "",
        },
    });

    const { create, loading: createLoading } = useCreate<ProductInput>("/api/products");
    const { update, loading: updateLoading } = useUpdate<ProductInput>("/api/products");
    const loading = isEditMode ? updateLoading : createLoading;

    const priceLabel = useMemo(() => category.priceLabel, [category]);

    const images = useWatch({ control, name: "images" });
    const specs = useWatch({ control, name: "specs" });
    const specsJsonText = useWatch({ control, name: "specsJsonText" });

    const specErrors = useMemo(() => {
        const result: Record<string, string> = {};
        for (const [key, err] of Object.entries(errors.specs ?? {})) {
            if (err && typeof err === "object" && "message" in err && typeof err.message === "string") {
                result[key] = err.message;
            }
        }
        return result;
    }, [errors.specs]);

    const onSubmit = handleSubmit(async (values) => {
        const finalSpecs: Record<string, unknown> = usesStructuredSpecs
            ? Object.fromEntries(Object.entries(values.specs).filter(([, value]) => value.trim() !== ""))
            : (values.specsJsonText.trim() ? JSON.parse(values.specsJsonText) : {});

        const input: ProductInput = {
            category: category.value,
            name: values.name,
            brand: values.brand || null,
            price: Number(values.price),
            discount_info: values.discount_info || null,
            images: values.images,
            specs: finalSpecs,
            price_options: initialData?.price_options ?? [],
            is_popular: values.is_popular,
            popular_order: values.popular_order.trim() ? Number(values.popular_order) : null,
            sort_order: initialData?.sort_order ?? 0,
        };

        const result = isEditMode ? await update(editId!, input) : await create(input);
        if (result) {
            router.push(`/admin/products/${category.value}`);
        } else {
            setVaild("저장에 실패했습니다.");
        }
    });

    return (
        <>
            <form onSubmit={onSubmit}>
                <div className="card space-y-6 p-6 md:p-8">
                    <div className="overflow-hidden rounded-xl border border-gray-100">
                        <FormRow label="카테고리" required>
                            <p className="form-input flex items-center bg-surface text-muted">{category.label}</p>
                        </FormRow>

                        <FormRow label="상품명" required>
                            <div className="flex w-full flex-col gap-1">
                                <input
                                    type="text"
                                    placeholder="상품명을 입력해주세요."
                                    className="form-input"
                                    {...register("name")}
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                            </div>
                        </FormRow>

                        <FormRow label="브랜드" required>
                            <div className="flex w-full flex-col gap-1">
                                <input
                                    type="text"
                                    placeholder={`${category.label} 브랜드`}
                                    className="form-input"
                                    {...register("brand")}
                                />
                                {errors.brand && <p className="text-sm text-red-500">{errors.brand.message}</p>}
                            </div>
                        </FormRow>

                        <FormRow label={priceLabel} required>
                            <div className="flex w-full flex-col gap-1">
                                <input
                                    type="number"
                                    placeholder="36000"
                                    className="form-input"
                                    {...register("price")}
                                />
                                {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                            </div>
                        </FormRow>

                        <FormRow label="할인 안내" required>
                            <div className="flex w-full flex-col gap-1">
                                <input
                                    type="text"
                                    placeholder="할인 안내 문구"
                                    className="form-input"
                                    {...register("discount_info")}
                                />
                                {errors.discount_info && <p className="text-sm text-red-500">{errors.discount_info.message}</p>}
                            </div>
                        </FormRow>

                        <FormRow label="인기상품 노출">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" {...register("is_popular")} />
                                <span className="text-base text-body">인기상품으로 노출</span>
                            </label>
                        </FormRow>

                        <FormRow label="인기상품 순서">
                            <div className="flex w-full flex-col gap-1">
                                <input
                                    type="number"
                                    placeholder="1"
                                    className="form-input"
                                    {...register("popular_order")}
                                />
                                {errors.popular_order && <p className="text-sm text-red-500">{errors.popular_order.message}</p>}
                            </div>
                        </FormRow>
                    </div>

                    {category.usesImages && (
                        <div className="flex flex-col gap-1.5">
                            <label className="form-label">이미지</label>
                            <ImageDropUploader
                                images={images}
                                onChange={(next) => setValue("images", next, { shouldValidate: true, shouldDirty: true })}
                            />
                        </div>
                    )}

                    <div className="border-t border-gray-100 pt-5">
                        <SpecFieldsForm
                            category={category}
                            specs={specs}
                            onChange={(next) => setValue("specs", next, { shouldValidate: true, shouldDirty: true })}
                            fallbackJsonText={specsJsonText}
                            onFallbackJsonChange={(text) => setValue("specsJsonText", text, { shouldValidate: true, shouldDirty: true })}
                            errors={specErrors}
                            fallbackError={errors.specsJsonText?.message}
                        />
                    </div>

                    <div className="flex justify-end gap-3 border-t border-gray-100 pt-2">
                        <Link href={`/admin/products/${category.value}`} className="admin-btn-ghost">
                            취소
                        </Link>
                        <button type="submit" disabled={loading} className="admin-btn-primary">
                            {loading ? (isEditMode ? "수정 중..." : "등록 중...") : (isEditMode ? "수정" : "등록")}
                        </button>
                    </div>
                </div>
            </form>
            <Toast vaild={vaild} setVaild={setVaild} />
        </>
    );
}
