import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/apiAuth";
import { isProductCategory } from "@/datas/productCategories";

// 관리자 상품 목록의 드래그 정렬 결과를 일괄 반영한다.
// { category, ids }: ids는 그 카테고리 안에서 바뀐 순서대로 정렬된 id 배열.
export async function PATCH(request: NextRequest) {
    const unauthorized = await requireAdmin(request);
    if (unauthorized) return unauthorized;

    const body = await request.json();
    const category = String(body.category ?? "");
    const ids = body.ids;

    if (!isProductCategory(category)) {
        return NextResponse.json({ error: "카테고리가 올바르지 않습니다." }, { status: 400 });
    }
    if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
        return NextResponse.json({ error: "정렬할 상품 id 목록이 필요합니다." }, { status: 400 });
    }

    const updates = await Promise.all(
        ids.map((id: string, index: number) =>
            supabaseAdmin.from("products").update({ sort_order: index }).eq("id", id).eq("category", category)
        )
    );

    const failed = updates.find((result) => result.error);
    if (failed?.error) {
        return NextResponse.json({ error: failed.error.message }, { status: 500 });
    }

    return NextResponse.json({ data: { ok: true } });
}
