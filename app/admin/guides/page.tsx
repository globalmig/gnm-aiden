import { redirect } from "next/navigation";
import { GUIDE_CATEGORIES } from "@/datas/guideCategories";

// 카테고리 선택은 사이드바("사용 가이드" 하위 메뉴)에서 하므로,
// 이 경로는 첫 번째 카테고리로 바로 보낸다.
export default function AdminGuidesPage() {
    redirect(`/admin/guides/${GUIDE_CATEGORIES[0].value}`);
}
