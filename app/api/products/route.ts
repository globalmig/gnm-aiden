import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/apiAuth";

export async function GET(request: NextRequest) {
    const category = request.nextUrl.searchParams.get("category");

    let query = supabaseAdmin.from("products").select("*").order("created_at", { ascending: false });
    if (category) query = query.eq("category", category);

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
    const unauthorized = await requireAdmin(request);
    if (unauthorized) return unauthorized;

    const body = await request.json();
    const category = String(body.category ?? "");
    const name = String(body.name ?? "").trim();
    const price = Number(body.price);

    if (!["internet", "tv"].includes(category)) {
        return NextResponse.json({ error: "카테고리를 선택해주세요." }, { status: 400 });
    }
    if (!name) {
        return NextResponse.json({ error: "상품명을 입력해주세요." }, { status: 400 });
    }
    if (!Number.isFinite(price)) {
        return NextResponse.json({ error: "가격을 입력해주세요." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
        .from("products")
        .insert({
            category,
            name,
            brand: body.brand || null,
            price,
            discount_info: body.discount_info || null,
            images: Array.isArray(body.images) ? body.images : [],
            specs: body.specs ?? {},
            price_options: body.price_options ?? [],
            is_popular: !!body.is_popular,
            popular_order: body.popular_order ?? null,
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
}
