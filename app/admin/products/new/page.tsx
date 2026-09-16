import ProductForm from "@/components/form/ProductForm";

export default function AdminProductNewPage() {
    return (
        <div>
            <h1 className="mb-6 text-lg font-bold text-title">새 상품 등록</h1>
            <ProductForm />
        </div>
    );
}
