import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/apiAuth";
import { productPayloadSchema } from "@/lib/schemas/product";

export async function GET(request: NextRequest) {
    const category = request.nextUrl.searchParams.get("category");

    let query = supabaseAdmin.from("products").select("*");
    if (category) {
        query = query.eq("category", category).order("sort_order", { ascending: true });
    } else {
        query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
    const unauthorized = await requireAdmin(request);
    if (unauthorized) return unauthorized;

    const parsed = productPayloadSchema.safeParse(await request.json());
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const { category, name, brand, price, discount_info, images, specs, price_options, is_popular, popular_order } = parsed.data;

    const { count } = await supabaseAdmin
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("category", category);

    const { data, error } = await supabaseAdmin
        .from("products")
        .insert({
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
            sort_order: count ?? 0,
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
}
