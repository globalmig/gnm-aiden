import { supabaseAdmin } from "./supabaseAdmin";
import { STORAGE_BUCKET } from "./storage";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const STORAGE_URL_MARKER = `/storage/v1/object/public/${STORAGE_BUCKET}/`;

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

export function isOwnStorageUrl(url: unknown): url is string {
    return typeof url === "string" && url.startsWith(supabaseUrl) && url.includes(STORAGE_URL_MARKER);
}

export async function deleteProductImage(publicUrl: string) {
    const markerIndex = publicUrl.indexOf(STORAGE_URL_MARKER);
    if (markerIndex === -1) return;

    const filePath = publicUrl.slice(markerIndex + STORAGE_URL_MARKER.length);
    await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([filePath]);
}
