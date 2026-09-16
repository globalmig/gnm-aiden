"use client";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QuillEditor from "../board/QuillEditor";
import Toast from "../ui/Toast";
import { useCreate } from "@/hooks/useCreate";
import { useUpdate } from "@/hooks/useUpdate";
import type { Notice } from "@/types/notice";

interface NoticeFormOwnProps {
    editId?: string;
    initialData?: Pick<Notice, "title" | "content" | "is_pinned">;
}

export default function NoticeForm({ editId, initialData }: NoticeFormOwnProps = {}) {
    const isEditMode = !!editId;
    const router = useRouter();

    const [form, setForm] = useState({
        title: initialData?.title ?? "",
        content: initialData?.content ?? "",
        is_pinned: initialData?.is_pinned ?? false,
    });
    const [vaild, setVaild] = useState<string | null>(null);

    const { create, loading: createLoading } = useCreate("/api/notices");
    const { update, loading: updateLoading } = useUpdate("/api/notices");
    const loading = isEditMode ? updateLoading : createLoading;

    const onChangeForm = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }, []);

    const onChangePinned = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, is_pinned: e.target.checked }));
    }, []);

    const onSubmitForm = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        if (!form.title.trim()) { setVaild("제목을 입력해주세요."); return; }
        if (!form.content.replace(/<[^>]*>/g, "").trim()) { setVaild("내용을 입력해주세요."); return; }

        const result = isEditMode ? await update(editId!, form) : await create(form);
        if (result) {
            router.push("/admin/notices");
        } else {
            setVaild("저장에 실패했습니다.");
        }
    }, [form, loading, isEditMode, editId, update, create, router]);

    return (
        <>
            <form onSubmit={onSubmitForm}>
                <div className="card p-6 md:p-8 space-y-5">

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="title" className="form-label">
                            제목 <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder="제목을 입력해주세요."
                            value={form.title}
                            onChange={onChangeForm}
                            className="form-input"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_pinned"
                            name="is_pinned"
                            checked={form.is_pinned}
                            onChange={onChangePinned}
                            className="h-4 w-4"
                        />
                        <label htmlFor="is_pinned" className="text-sm font-medium text-body">
                            중요 공지로 등록 (목록 최상단에 고정)
                        </label>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="form-label">
                            내용 <span className="text-red-400">*</span>
                        </label>
                        <QuillEditor
                            value={form.content}
                            onChange={(content) => setForm((prev) => ({ ...prev, content }))}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                        <Link href="/admin/notices" className="admin-btn-ghost">
                            취소
                        </Link>
                        <button type="submit" disabled={loading} className="admin-btn-primary">
                            {loading
                                ? (isEditMode ? "수정 중..." : "등록 중...")
                                : (isEditMode ? "수정" : "등록")}
                        </button>
                    </div>
                </div>
            </form>
            <Toast vaild={vaild} setVaild={setVaild} />
        </>
    );
}
