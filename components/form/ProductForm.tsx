"use client";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Toast from "../ui/Toast";
import ImageDropUploader from "./ImageDropUploader";
import SpecFieldsForm from "./SpecFieldsForm";
import { useCreate } from "@/hooks/useCreate";
import { useUpdate } from "@/hooks/useUpdate";
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

    const [name, setName] = useState(initialData?.name ?? "");
    const [brand, setBrand] = useState(initialData?.brand ?? "");
    const [price, setPrice] = useState(initialData ? String(initialData.price) : "");
    const [discountInfo, setDiscountInfo] = useState(initialData?.discount_info ?? "");
    const [isPopular, setIsPopular] = useState(initialData?.is_popular ?? false);
    const [popularOrder, setPopularOrder] = useState(initialData?.popular_order?.toString() ?? "");
    const [images, setImages] = useState<string[]>(initialData?.images ?? []);
    const [specs, setSpecs] = useState<Record<string, string>>(() => toStructuredSpecs(initialData?.specs));
    const [specsJsonText, setSpecsJsonText] = useState(initialData ? toTextarea(initialData.specs) : "");

    const [vaild, setVaild] = useState<string | null>(null);

    const { create, loading: createLoading } = useCreate<ProductInput>("/api/products");
    const { update, loading: updateLoading } = useUpdate<ProductInput>("/api/products");
    const loading = isEditMode ? updateLoading : createLoading;

    const priceLabel = useMemo(() => category.priceLabel, [category]);

    const onSubmitForm = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        if (!name.trim()) { setVaild("상품명을 입력해주세요."); return; }
        if (!price.trim() || Number.isNaN(Number(price))) { setVaild("가격을 숫자로 입력해주세요."); return; }

        let finalSpecs: Record<string, unknown>;
        if (usesStructuredSpecs) {
            finalSpecs = Object.fromEntries(Object.entries(specs).filter(([, value]) => value.trim() !== ""));
        } else {
            try {
                finalSpecs = specsJsonText.trim() ? JSON.parse(specsJsonText) : {};
            } catch {
                setVaild("스펙(specs)이 올바른 JSON 형식이 아닙니다.");
                return;
            }
        }

        const input: ProductInput = {
            category: category.value,
            name: name.trim(),
            brand: brand.trim() || null,
            price: Number(price),
            discount_info: discountInfo.trim() || null,
            images,
            specs: finalSpecs,
            price_options: initialData?.price_options ?? [],
            is_popular: isPopular,
            popular_order: popularOrder.trim() ? Number(popularOrder) : null,
            sort_order: initialData?.sort_order ?? 0,
        };

        const result = isEditMode ? await update(editId!, input) : await create(input);
        if (result) {
            router.push(`/admin/products/${category.value}`);
        } else {
            setVaild("저장에 실패했습니다.");
        }
    }, [
        loading, name, price, specs, specsJsonText, usesStructuredSpecs, category, brand,
        discountInfo, images, isPopular, popularOrder, isEditMode, editId, initialData, update, create, router,
    ]);

    return (
        <>
            <form onSubmit={onSubmitForm}>
                <div className="card space-y-5 p-6 md:p-8">
                    <div className="grid grid-cols-1 gap-5 pc:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                            <label className="form-label">카테고리</label>
                            <p className="form-input flex items-center bg-surface text-muted">{category.label}</p>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="form-label">상품명 <span className="text-primary">*</span></label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="상품명을 입력해주세요."
                                className="form-input"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="form-label">브랜드</label>
                            <input
                                type="text"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                placeholder={`${category.label} 브랜드`}
                                className="form-input"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="form-label">{priceLabel} <span className="text-primary">*</span></label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="36000"
                                className="form-input"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5 pc:col-span-2">
                            <label className="form-label">할인 안내</label>
                            <input
                                type="text"
                                value={discountInfo}
                                onChange={(e) => setDiscountInfo(e.target.value)}
                                placeholder="할인 안내 문구"
                                className="form-input"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="form-label">인기상품 순서</label>
                            <input
                                type="number"
                                value={popularOrder}
                                onChange={(e) => setPopularOrder(e.target.value)}
                                placeholder="1"
                                className="form-input"
                            />
                        </div>

                        <label className="flex items-center gap-2 pc:mt-7">
                            <input
                                type="checkbox"
                                checked={isPopular}
                                onChange={(e) => setIsPopular(e.target.checked)}
                            />
                            <span className="text-base text-body">인기상품으로 노출</span>
                        </label>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="form-label">이미지</label>
                        <ImageDropUploader images={images} onChange={setImages} />
                    </div>

                    <div className="border-t border-gray-100 pt-5">
                        <SpecFieldsForm
                            category={category}
                            specs={specs}
                            onChange={setSpecs}
                            fallbackJsonText={specsJsonText}
                            onFallbackJsonChange={setSpecsJsonText}
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
