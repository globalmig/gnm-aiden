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

    // 비밀글은 답변(replies) 내용에 개인정보가 포함될 수 있어 목록에서도 내려주지 않는다.
    // 댓글 수 배지가 replies.length를 쓰므로 개수는 유지하고 내용만 비운다.
    const masked = (data ?? []).map((item) =>
        item.is_secret
            ? { ...item, replies: ((item.replies as unknown[]) ?? []).map(() => ({ author: "", content: "", created_at: "" })) }
            : item
    );

    return NextResponse.json({ data: masked });
}
