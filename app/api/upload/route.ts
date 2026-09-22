import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/apiAuth";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE, STORAGE_BUCKET } from "@/lib/storage";
import { buildStoragePath, deleteProductImage, getPublicImageUrl, isOwnStorageUrl } from "@/lib/uploadImage";

export async function POST(request: NextRequest) {
    const unauthorized = await requireAdmin(request);
    if (unauthorized) return unauthorized;

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
        return NextResponse.json({ error: "업로드할 파일이 없습니다." }, { status: 400 });
    }
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        return NextResponse.json({ error: "이미지 파일(jpg, png, webp, gif)만 업로드할 수 있습니다." }, { status: 400 });
    }
    if (file.size > MAX_IMAGE_SIZE) {
        return NextResponse.json({ error: "이미지 용량은 5MB를 넘을 수 없습니다." }, { status: 400 });
    }

    const path = buildStoragePath(file.name, "detail");
    const { error } = await supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .upload(path, file, { contentType: file.type });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: { url: getPublicImageUrl(path) } }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
    const unauthorized = await requireAdmin(request);
    if (unauthorized) return unauthorized;

    const body = await request.json();
    const url = body.url;

    if (isOwnStorageUrl(url)) {
        await deleteProductImage(url);
    }

    return NextResponse.json({ data: { ok: true } });
}
