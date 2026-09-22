"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import SortableProductList from "@/components/admin/SortableProductList";
import { useDelete } from "@/hooks/useDelete";
import { authFetch } from "@/lib/apiFetch";
import { getCategoryDef } from "@/datas/productCategories";
import type { Product } from "@/types/product";

export default function AdminCategoryProductsPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = use(params);
    const categoryDef = getCategoryDef(category);

    const [products, setProducts] = useState<Product[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [search, setSearch] = useState("");

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const response = await fetch(`/api/products?category=${category}`);
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
            setProducts(result.data);
        } catch {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }, [category]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const { remove } = useDelete("/api/products", { onSuccess: fetchProducts });

    const handleDelete = (id: string) => {
        if (!confirm("이 상품을 삭제할까요?")) return;
        remove(id);
    };

    const handleReorder = async (orderedIds: string[]) => {
        if (!products) return;
        const reordered = orderedIds
            .map((id) => products.find((product) => product.id === id))
            .filter((product): product is Product => !!product);
        setProducts(reordered);

        const response = await authFetch("/api/products/reorder", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ category, ids: orderedIds }),
        });
        if (!response.ok) fetchProducts();
    };

    if (!categoryDef) notFound();

    const keyword = search.trim().toLowerCase();
    const filteredProducts = products?.filter((product) => product.name.toLowerCase().includes(keyword)) ?? null;
    const isFiltering = keyword.length > 0;

    return (
        <div className="card p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="mt-1 text-lg font-bold text-title">{categoryDef.label} 제품관리</h1>
                </div>
                <Link href={`/admin/products/${category}/new`} className="admin-btn-primary">
                    새 상품 등록
                </Link>
            </div>

            <div className="mt-4">
                <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="상품명 검색"
                    className="form-input max-w-80"
                />
            </div>

            <div className="mt-6">
                {isLoading && <p className="text-base text-muted">불러오는 중...</p>}
                {isError && <p className="text-base text-red-400">목록을 불러오지 못했습니다.</p>}

                {filteredProducts && filteredProducts.length === 0 && (
                    <p className="text-base text-muted">
                        {isFiltering ? "검색 결과가 없습니다." : "등록된 상품이 없습니다."}
                    </p>
                )}

                {filteredProducts && filteredProducts.length > 0 && (
                    <>
                        <p className="mb-3 text-xs text-muted">
                            {isFiltering
                                ? "검색 중에는 드래그 순서 변경이 비활성화됩니다. 검색어를 지우면 다시 사용할 수 있어요."
                                : "드래그해서 노출 순서를 바꿀 수 있습니다."}
                        </p>
                        <SortableProductList
                            products={filteredProducts}
                            categoryValue={category}
                            sortable={!isFiltering}
                            onReorder={handleReorder}
                            onDelete={handleDelete}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
