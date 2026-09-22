import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// 공식홈 문의 게시판 목록용: 비회원도 조회 가능하며 연락처 등 개인정보는 내려주지 않는다.
export async function GET() {
    const { data, error } = await supabaseAdmin
        .from("inquiries")
        .select("id, title, name, is_secret, status, replies, created_at")
        .eq("source", "main")
        .order("created_at", { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
}
