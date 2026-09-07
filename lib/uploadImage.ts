import { supabaseAdmin } from "./supabaseAdmin";
import { STORAGE_BUCKET } from "./storage";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const STORAGE_URL_MARKER = `/storage/v1/object/public/${STORAGE_BUCKET}/`;

// 서명된 업로드 URL을 발급할 스토리지 경로 생성
// (한글/공백 등이 섞인 파일명은 공개 URL에서 깨질 수 있어 안전한 문자로 치환)
export function buildStoragePath(fileName: string, folder: "main" | "detail") {
    const safeName = fileName
        .normalize("NFKD")
        .replace(/[^a-zA-Z0-9.\-_]/g, "_");
    return `${folder}/${Date.now()}_${safeName}`;
}

export function getPublicImageUrl(path: string) {
    const { data } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
}

// 클라이언트가 보낸 이미지 URL이 실제로 우리 버킷 소속인지 검증 (임의 외부 URL 주입 방지)
export function isOwnStorageUrl(url: unknown): url is string {
    return typeof url === "string" && url.startsWith(supabaseUrl) && url.includes(STORAGE_URL_MARKER);
}

export async function deleteProductImage(publicUrl: string) {
    const markerIndex = publicUrl.indexOf(STORAGE_URL_MARKER);
    if (markerIndex === -1) return;

    const filePath = publicUrl.slice(markerIndex + STORAGE_URL_MARKER.length);
    await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([filePath]);
}
