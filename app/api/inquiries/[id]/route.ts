import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/apiAuth";
import { verifyPassword } from "@/lib/password";

// 비밀번호 확인 없이 원본 내용을 그대로 내려주므로 관리자만 접근할 수 있다.
// 비회원은 /api/inquiries/[id]/public 을 사용한다.
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const unauthorized = await requireAdmin(request);
    if (unauthorized) return unauthorized;

    const { id } = await params;

    const { data, error } = await supabaseAdmin.from("inquiries").select("*").eq("id", id).single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ data: { ...data, password_hash: null } });
}

// 답변/댓글 등록: { reply: { content }, role, password } 형태로 요청하면 replies 배열에 추가한다.
// role이 "customer"이면 비밀글 작성자로 간주해 password를 비밀번호와 대조하고, 상태는 다시 "대기"로 되돌린다.
// role을 생략하거나 "admin"이면 관리자 답변으로 간주해 상태를 "답변완료"로 바꾼다.
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();

    const { data: current, error: fetchError } = await supabaseAdmin
        .from("inquiries")
        .select("replies, is_secret, password_hash")
        .eq("id", id)
        .single();

    if (fetchError) {
        return NextResponse.json({ error: fetchError.message }, { status: 404 });
    }

    const update: Record<string, unknown> = {};

    if (body.reply) {
        const role = body.role === "customer" ? "customer" : "admin";
        const content = String(body.reply.content ?? "").trim();

        if (role === "admin") {
            const unauthorized = await requireAdmin(request);
            if (unauthorized) return unauthorized;
        }

        if (!content) {
            return NextResponse.json({ error: "내용을 입력해주세요." }, { status: 400 });
        }

        if (role === "customer" && current.is_secret) {
            const password = String(body.password ?? "").trim();
            if (!verifyPassword(password, current.password_hash)) {
                return NextResponse.json({ error: "비밀번호가 일치하지 않습니다." }, { status: 401 });
            }
        }

        const author = String(body.reply.author ?? (role === "customer" ? "작성자" : "관리자")).trim();

        update.replies = [
            ...((current?.replies as unknown[]) ?? []),
            { author, content, created_at: new Date().toISOString() },
        ];
        update.status = role === "admin" ? "답변완료" : "대기";
    }

    if (body.status && !body.reply) {
        const unauthorized = await requireAdmin(request);
        if (unauthorized) return unauthorized;

        update.status = body.status;
    }

    const { data, error } = await supabaseAdmin
        .from("inquiries")
        .update(update)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: { ...data, password_hash: null } });
}

// 관리자는 그대로 삭제하고, 문의 고객(role: "customer")은 비밀글 비밀번호를 재입력해야 삭제할 수 있다.
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    let body: Record<string, unknown> = {};
    try {
        body = await request.json();
    } catch {
        body = {};
    }

    const role = body.role === "customer" ? "customer" : "admin";

    if (role === "customer") {
        const password = String(body.password ?? "").trim();

        const { data: current, error: fetchError } = await supabaseAdmin
            .from("inquiries")
            .select("is_secret, password_hash")
            .eq("id", id)
            .single();

        if (fetchError || !current) {
            return NextResponse.json({ error: "문의를 찾을 수 없습니다." }, { status: 404 });
        }

        if (!current.is_secret || !verifyPassword(password, current.password_hash)) {
            return NextResponse.json({ error: "비밀번호가 일치하지 않습니다." }, { status: 401 });
        }
    } else {
        const unauthorized = await requireAdmin(request);
        if (unauthorized) return unauthorized;
    }

    const { error } = await supabaseAdmin.from("inquiries").delete().eq("id", id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: { id } });
}
