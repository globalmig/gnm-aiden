import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// 관리자 전용 API 라우트에서 호출한다. 인증 실패 시 반환할 NextResponse를,
// 인증 성공 시 null을 반환하므로 호출부에서 `if (res) return res;` 형태로 사용한다.
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
    const authHeader = request.headers.get("authorization") ?? "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";

    if (!token) {
        return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
        return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    return null;
}
