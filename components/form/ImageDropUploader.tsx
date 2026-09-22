"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { authFetch } from "@/lib/apiFetch";

interface ImageDropUploaderProps {
    images: string[];
    onChange: (images: string[]) => void;
}

export default function ImageDropUploader({ images, onChange }: ImageDropUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadingCount, setUploadingCount] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const uploadFiles = useCallback(async (files: FileList | File[]) => {
        const fileArray = Array.from(files);
        if (fileArray.length === 0) return;

        setError(null);
        setUploadingCount((count) => count + fileArray.length);

        const uploaded: string[] = [];
        for (const file of fileArray) {
            try {
                const formData = new FormData();
                formData.append("file", file);
                const response = await authFetch("/api/upload", { method: "POST", body: formData });
                const result = await response.json();
                if (!response.ok) throw new Error(result.error || "업로드에 실패했습니다.");
                uploaded.push(result.data.url as string);
            } catch (err) {
                setError(err instanceof Error ? err.message : "업로드 중 오류가 발생했습니다.");
            } finally {
                setUploadingCount((count) => count - 1);
            }
        }

        if (uploaded.length > 0) {
            onChange([...images, ...uploaded]);
        }
    }, [images, onChange]);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
    }, [uploadFiles]);

    const handleRemove = useCallback(async (url: string) => {
        onChange(images.filter((image) => image !== url));
        try {
            await authFetch("/api/upload", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });
        } catch {
            // 스토리지 삭제 실패는 조용히 무시한다 (폼 상의 이미지 목록에서는 이미 제거됨)
        }
    }, [images, onChange]);

    return (
        <div className="flex flex-col gap-3">
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
                className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors cursor-pointer ${
                    isDragging ? "border-primary bg-sky-light" : "border-black/15 hover:border-primary/50"
                }`}
            >
                <p className="text-sm font-medium text-title">이미지를 이곳에 끌어다 놓거나 클릭해서 업로드</p>
                <p className="text-xs text-muted">JPG, PNG, WEBP, GIF · 최대 5MB</p>
                {uploadingCount > 0 && <p className="text-xs text-primary">{uploadingCount}개 업로드 중...</p>}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                        if (e.target.files?.length) uploadFiles(e.target.files);
                        e.target.value = "";
                    }}
                />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 pc:grid-cols-6">
                    {images.map((url) => (
                        <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border border-black/10">
                            <Image src={url} alt="" fill sizes="120px" className="object-cover" />
                            <button
                                type="button"
                                onClick={() => handleRemove(url)}
                                aria-label="이미지 삭제"
                                className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
