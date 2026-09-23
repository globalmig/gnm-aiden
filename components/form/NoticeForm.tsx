"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QuillEditor from "../board/QuillEditor";
import Toast from "../ui/Toast";
import { useCreate } from "@/hooks/useCreate";
import { useUpdate } from "@/hooks/useUpdate";
import { noticeSchema, type NoticeFormValues } from "@/lib/schemas/notice";
import type { Notice } from "@/types/notice";

interface NoticeFormOwnProps {
    editId?: string;
    initialData?: Pick<Notice, "title" | "content" | "is_pinned">;
}

export default function NoticeForm({ editId, initialData }: NoticeFormOwnProps = {}) {
    const isEditMode = !!editId;
    const router = useRouter();
    const [vaild, setVaild] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<NoticeFormValues>({
        resolver: zodResolver(noticeSchema),
        defaultValues: {
            title: initialData?.title ?? "",
            content: initialData?.content ?? "",
            is_pinned: initialData?.is_pinned ?? false,
        },
    });

    const { create, loading: createLoading } = useCreate("/api/notices");
    const { update, loading: updateLoading } = useUpdate("/api/notices");
    const loading = isEditMode ? updateLoading : createLoading;

    const onSubmit = handleSubmit(async (values) => {
        const result = isEditMode ? await update(editId!, values) : await create(values);
        if (result) {
            router.push("/admin/notices");
        } else {
            setVaild("저장에 실패했습니다.");
        }
    });

    return (
        <>
            <form onSubmit={onSubmit}>
                <div className="card p-6 md:p-8 space-y-5">

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="title" className="form-label">
                            제목 <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            placeholder="제목을 입력해주세요."
                            className="form-input"
                            {...register("title")}
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500">{errors.title.message}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_pinned"
                            className="h-4 w-4"
                            {...register("is_pinned")}
                        />
                        <label htmlFor="is_pinned" className="text-sm font-medium text-body">
                            중요 공지로 등록 (목록 최상단에 고정)
                        </label>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="form-label">
                            내용 <span className="text-red-400">*</span>
                        </label>
                        <Controller
                            name="content"
                            control={control}
                            render={({ field }) => (
                                <QuillEditor value={field.value} onChange={field.onChange} />
                            )}
                        />
                        {errors.content && (
                            <p className="text-sm text-red-500">{errors.content.message}</p>
                        )}
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
