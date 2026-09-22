"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import ProductForm from "@/components/form/ProductForm";
import { getCategoryDef } from "@/datas/productCategories";

export default function AdminProductNewPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = use(params);
    const categoryDef = getCategoryDef(category);
    if (!categoryDef) notFound();

    return (
        <div>
            <h1 className="mb-6 text-lg font-bold text-title">{categoryDef.label} 상품 등록</h1>
            <ProductForm category={categoryDef} />
        </div>
    );
}
