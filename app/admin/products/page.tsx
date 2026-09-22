import { redirect } from "next/navigation";
import { PRODUCT_CATEGORIES } from "@/datas/productCategories";

// 카테고리 선택은 사이드바("제품 관리" 하위 메뉴)에서 하므로,
// 이 경로는 첫 번째 카테고리 목록으로 바로 보낸다.
export default function AdminProductsPage() {
    redirect(`/admin/products/${PRODUCT_CATEGORIES[0].value}`);
}
