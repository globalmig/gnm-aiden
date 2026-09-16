import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// 비회원 상세 조회용: 비밀글은 비밀번호 확인 전까지 내용/답변/비밀번호를 내려주지 않는다.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const { data, error } = await supabaseAdmin.from("inquiries").select("*").eq("id", id).single();

    if (error || !data) {
        return NextResponse.json({ error: "문의를 찾을 수 없습니다." }, { status: 404 });
    }

    if (data.is_secret) {
        return NextResponse.json({ data: { ...data, content: "", replies: [], password_hash: null } });
    }

    return NextResponse.json({ data: { ...data, password_hash: null } });
}
