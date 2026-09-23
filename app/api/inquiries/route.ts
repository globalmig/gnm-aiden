import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/apiAuth";
import { hashPassword } from "@/lib/password";

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
    const source = body.source === "landing" ? "landing" : "main";
    const isSecret = !!body.is_secret;
    const password = String(body.password ?? "").trim();

    if (isSecret && !password) {
        return NextResponse.json({ error: "비밀글 비밀번호를 입력해주세요." }, { status: 400 });
    }

    if (!name) {
        return NextResponse.json({ error: "이름을 입력해주세요." }, { status: 400 });
    }
    if (!phone) {
        return NextResponse.json({ error: "연락처를 입력해주세요." }, { status: 400 });
    }
    if (!content) {
        return NextResponse.json({ error: "문의 내용을 입력해주세요." }, { status: 400 });
    }

    // 랜딩페이지 리드 전용 필드. source가 "main"이면 전부 null로 저장된다.
    const landingFields =
        source === "landing"
            ? {
                  category: body.category ? String(body.category) : null,
                  bundle_discount_opt_in: !!body.bundle_discount_opt_in,
                  agree_collection: !!body.agree_collection,
                  agree_third_party: !!body.agree_third_party,
                  agree_age: !!body.agree_age,
              }
            : {};

    const { data, error } = await supabaseAdmin
        .from("inquiries")
        .insert({
            source,
            name,
            phone,
            title: body.title || null,
            content,
            is_secret: isSecret,
            password_hash: isSecret ? hashPassword(password) : null,
            ...landingFields,
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
}
