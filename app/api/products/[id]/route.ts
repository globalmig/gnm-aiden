import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/apiAuth";
import { productPayloadSchema } from "@/lib/schemas/product";

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
    const parsed = productPayloadSchema.safeParse(await request.json());
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const { category, name, brand, price, discount_info, images, specs, price_options, is_popular, popular_order, sort_order } = parsed.data;

    const { data, error } = await supabaseAdmin
        .from("products")
        .update({
            category,
            name,
            brand: brand || null,
            price,
            discount_info: discount_info || null,
            images: images ?? [],
            specs: specs ?? {},
            price_options: price_options ?? [],
            is_popular: !!is_popular,
            popular_order: popular_order ?? null,
            ...(sort_order !== undefined ? { sort_order } : {}),
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
