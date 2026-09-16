"use client";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Toast from "../ui/Toast";
import { useCreate } from "@/hooks/useCreate";
import { useUpdate } from "@/hooks/useUpdate";
import type { Product, ProductInput } from "@/types/product";

interface ProductFormOwnProps {
    editId?: string;
    initialData?: Product;
}

function toTextarea(value: string[] | Record<string, unknown> | unknown[]) {
    if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
        return (value as string[]).join("\n");
    }
    return JSON.stringify(value, null, 2);
}

export default function ProductForm({ editId, initialData }: ProductFormOwnProps = {}) {
    const isEditMode = !!editId;
    const router = useRouter();

    const [category, setCategory] = useState<"internet" | "tv">(initialData?.category ?? "internet");
    const [name, setName] = useState(initialData?.name ?? "");
    const [brand, setBrand] = useState(initialData?.brand ?? "");
    const [price, setPrice] = useState(initialData ? String(initialData.price) : "");
    const [discountInfo, setDiscountInfo] = useState(initialData?.discount_info ?? "");
    const [isPopular, setIsPopular] = useState(initialData?.is_popular ?? false);
    const [popularOrder, setPopularOrder] = useState(initialData?.popular_order?.toString() ?? "");
    const [imagesText, setImagesText] = useState(initialData ? toTextarea(initialData.images) : "");
    const [specsText, setSpecsText] = useState(initialData ? toTextarea(initialData.specs) : "{}");
    const [priceOptionsText, setPriceOptionsText] = useState(
        initialData ? toTextarea(initialData.price_options) : "[]"
    );

    const [vaild, setVaild] = useState<string | null>(null);

    const { create, loading: createLoading } = useCreate<ProductInput>("/api/products");
    const { update, loading: updateLoading } = useUpdate<ProductInput>("/api/products");
    const loading = isEditMode ? updateLoading : createLoading;

    const onSubmitForm = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        if (!name.trim()) { setVaild("상품명을 입력해주세요."); return; }
        if (!price.trim() || Number.isNaN(Number(price))) { setVaild("가격을 숫자로 입력해주세요."); return; }

        let specs: Record<string, unknown>;
        let priceOptions: unknown[];
        try {
            specs = specsText.trim() ? JSON.parse(specsText) : {};
        } catch {
            setVaild("스펙(specs)이 올바른 JSON 형식이 아닙니다.");
            return;
        }
        try {
            priceOptions = priceOptionsText.trim() ? JSON.parse(priceOptionsText) : [];
        } catch {
            setVaild("요금 옵션(price_options)이 올바른 JSON 형식이 아닙니다.");
            return;
        }

        const input: ProductInput = {
            category,
            name: name.trim(),
            brand: brand.trim() || null,
            price: Number(price),
            discount_info: discountInfo.trim() || null,
            images: imagesText.split("\n").map((s) => s.trim()).filter(Boolean),
            specs,
            price_options: priceOptions,
            is_popular: isPopular,
            popular_order: popularOrder.trim() ? Number(popularOrder) : null,
        };

        const result = isEditMode ? await update(editId!, input) : await create(input);
        if (result) {
            router.push("/admin/products");
        } else {
            setVaild("저장에 실패했습니다.");
        }
    }, [
        loading, name, price, specsText, priceOptionsText, category, brand, discountInfo,
        imagesText, isPopular, popularOrder, isEditMode, editId, update, create, router,
    ]);

    return (
        <>
            <form onSubmit={onSubmitForm}>
                <div className="card space-y-5 p-6 md:p-8">
                    <div className="grid grid-cols-1 gap-5 pc:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                            <label className="form-label">카테고리 <span className="text-red-400">*</span></label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value as "internet" | "tv")}
                                className="form-input"
                            >
                                <option value="internet">인터넷</option>
                                <option value="tv">TV</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="form-label">상품명 <span className="text-red-400">*</span></label>
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
                                placeholder="TV 브랜드 (인터넷 요금제는 비워두세요)"
                                className="form-input"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="form-label">가격 (월 요금) <span className="text-red-400">*</span></label>
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
                        <label className="form-label">이미지 URL (줄바꿈으로 구분)</label>
                        <textarea
                            value={imagesText}
                            onChange={(e) => setImagesText(e.target.value)}
                            rows={3}
                            placeholder={"https://.../image1.png\nhttps://.../image2.png"}
                            className="form-input font-mono text-sm"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="form-label">상세 스펙 (JSON)</label>
                        <textarea
                            value={specsText}
                            onChange={(e) => setSpecsText(e.target.value)}
                            rows={5}
                            placeholder={'{ "speed": "500M", "resolution": "4K" }'}
                            className="form-input font-mono text-sm"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="form-label">조건별 요금 옵션 (JSON 배열, 주로 TV)</label>
                        <textarea
                            value={priceOptionsText}
                            onChange={(e) => setPriceOptionsText(e.target.value)}
                            rows={4}
                            placeholder={'[{ "contract_period": "36개월", "monthly_fee": 29000 }]'}
                            className="form-input font-mono text-sm"
                        />
                    </div>

                    <div className="flex justify-end gap-3 border-t border-gray-100 pt-2">
                        <Link href="/admin/products" className="admin-btn-ghost">
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
