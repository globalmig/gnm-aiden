"use client";

import { useCallback, useState } from "react";

export interface CommentFormProps {
    onSubmit: (content: string) => Promise<boolean> | boolean;
    loading?: boolean;
    label?: string;
    placeholder?: string;
    submitLabel?: string;
    loadingLabel?: string;
    multiline?: boolean;
    buttonClassName?: string;
}

export default function CommentForm({
    onSubmit,
    loading = false,
    label,
    placeholder = "댓글을 입력해주세요",
    submitLabel = "등록",
    loadingLabel = "등록 중...",
    multiline = false,
    buttonClassName = "btn-primary shrink-0",
}: CommentFormProps) {
    const [content, setContent] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (loading) return;

            if (!content.trim()) {
                setError("내용을 입력해주세요.");
                return;
            }

            setError(null);
            const success = await onSubmit(content.trim());
            if (success) setContent("");
        },
        [content, loading, onSubmit]
    );

    if (multiline) {
        return (
            <form onSubmit={handleSubmit} className="space-y-3">
                {label && <label className="form-label">{label}</label>}
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    placeholder={placeholder}
                    className="form-input"
                />
                {error && <p className="text-sm text-red-400">{error}</p>}
                <div className="flex justify-end">
                    <button type="submit" disabled={loading} className={buttonClassName}>
                        {loading ? loadingLabel : submitLabel}
                    </button>
                </div>
            </form>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-1.5">
            {label && <label className="form-label">{label}</label>}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={placeholder}
                    className="form-input flex-1"
                />
                <button type="submit" disabled={loading} className={buttonClassName}>
                    {loading ? loadingLabel : submitLabel}
                </button>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
        </form>
    );
}
