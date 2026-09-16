import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/apiAuth";

export async function GET() {
    const { data, error } = await supabaseAdmin
        .from("notices")
        .select("*")
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
    const unauthorized = await requireAdmin(request);
    if (unauthorized) return unauthorized;

    const body = await request.json();
    const title = String(body.title ?? "").trim();
    const content = String(body.content ?? "").trim();
    const is_pinned = Boolean(body.is_pinned);

    if (!title) {
        return NextResponse.json({ error: "제목을 입력해주세요." }, { status: 400 });
    }
    if (!content) {
        return NextResponse.json({ error: "내용을 입력해주세요." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
        .from("notices")
        .insert({ title, content, is_pinned })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
}
