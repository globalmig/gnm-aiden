import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/apiAuth";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const { data, error } = await supabaseAdmin.from("products").select("*").eq("id", id).single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ data });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const unauthorized = await requireAdmin(request);
    if (unauthorized) return unauthorized;

    const { id } = await params;
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const price = Number(body.price);

    if (!name) {
        return NextResponse.json({ error: "상품명을 입력해주세요." }, { status: 400 });
    }
    if (!Number.isFinite(price)) {
        return NextResponse.json({ error: "가격을 입력해주세요." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
        .from("products")
        .update({
            category: body.category,
            name,
            brand: body.brand || null,
            price,
            discount_info: body.discount_info || null,
            images: Array.isArray(body.images) ? body.images : [],
            specs: body.specs ?? {},
            price_options: body.price_options ?? [],
            is_popular: !!body.is_popular,
            popular_order: body.popular_order ?? null,
            ...(body.sort_order !== undefined ? { sort_order: body.sort_order } : {}),
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const unauthorized = await requireAdmin(request);
    if (unauthorized) return unauthorized;

    const { id } = await params;

    const { error } = await supabaseAdmin.from("products").delete().eq("id", id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: { id } });
}
