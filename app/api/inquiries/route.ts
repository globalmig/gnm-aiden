import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/apiAuth";

// 전체 문의 목록(이름/연락처 포함)은 관리자만 조회할 수 있다.
export async function GET(request: NextRequest) {
    const unauthorized = await requireAdmin(request);
    if (unauthorized) return unauthorized;

    const { data, error } = await supabaseAdmin
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const content = String(body.content ?? "").trim();

    if (!name) {
        return NextResponse.json({ error: "이름을 입력해주세요." }, { status: 400 });
    }
    if (!phone) {
        return NextResponse.json({ error: "연락처를 입력해주세요." }, { status: 400 });
    }
    if (!content) {
        return NextResponse.json({ error: "문의 내용을 입력해주세요." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
        .from("inquiries")
        .insert({
            source: body.source === "landing" ? "landing" : "main",
            name,
            phone,
            title: body.title || null,
            content,
            is_secret: !!body.is_secret,
            password_hash: body.password_hash || null,
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
}
