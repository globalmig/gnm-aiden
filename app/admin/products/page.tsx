"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useDelete } from "@/hooks/useDelete";
import type { Product } from "@/types/product";

const CATEGORY_LABEL: Record<string, string> = {
    internet: "인터넷",
    tv: "TV",
};

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const response = await fetch("/api/products");
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
            setProducts(result.data);
        } catch {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const { remove } = useDelete("/api/products", { onSuccess: fetchProducts });

    const handleDelete = (id: string) => {
        if (!confirm("이 상품을 삭제할까요?")) return;
        remove(id);
    };

    return (
        <div className="card p-6 md:p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-bold text-title">제품 관리</h1>
                <Link href="/admin/products/new" className="admin-btn-primary">
                    새 상품 등록
                </Link>
            </div>

            <div className="mt-6">
                {isLoading && <p className="text-base text-muted">불러오는 중...</p>}
                {isError && <p className="text-base text-red-400">목록을 불러오지 못했습니다.</p>}

                {products && products.length === 0 && (
                    <p className="text-base text-muted">등록된 상품이 없습니다.</p>
                )}

                {products && products.length > 0 && (
                    <ul className="divide-y divide-gray-100">
                        {products.map((product) => (
                            <li key={product.id} className="flex items-center justify-between gap-4 py-3">
                                <div className="min-w-0">
                                    <p className="text-sm text-muted">
                                        {CATEGORY_LABEL[product.category]}
                                        {product.brand ? ` · ${product.brand}` : ""}
                                        {product.is_popular ? " · 인기상품" : ""}
                                    </p>
                                    <p className="truncate text-base font-medium text-title">{product.name}</p>
                                    <p className="mt-1 text-sm text-body">{product.price.toLocaleString()}원</p>
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                    <Link href={`/admin/products/${product.id}/edit`} className="admin-btn-ghost">
                                        수정
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(product.id)}
                                        className="admin-btn-ghost"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
