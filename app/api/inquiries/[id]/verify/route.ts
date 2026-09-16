import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// 비밀글 비밀번호 확인: 일치하면 잠금 해제된 전체 내용을 내려준다.
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();
    const password = String(body.password ?? "").trim();

    if (!password) {
        return NextResponse.json({ error: "비밀번호를 입력해주세요." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.from("inquiries").select("*").eq("id", id).single();

    if (error || !data) {
        return NextResponse.json({ error: "문의를 찾을 수 없습니다." }, { status: 404 });
    }

    if (!data.is_secret || password !== data.password_hash) {
        return NextResponse.json({ error: "비밀번호가 일치하지 않습니다." }, { status: 401 });
    }

    return NextResponse.json({ data: { ...data, password_hash: null } });
}
