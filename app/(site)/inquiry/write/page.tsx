"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CategoryBanner from "@/components/common/CategoryBanner";
import Toast from "@/components/ui/Toast";
import { useCreate } from "@/hooks/useCreate";
import type { InquiryInput } from "@/types/inquiry";

export default function InquiryWritePage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSecret, setIsSecret] = useState(true);
    const [password, setPassword] = useState("");
    const [vaild, setVaild] = useState<string | null>(null);

    const { create, loading } = useCreate<InquiryInput>("/api/inquiries");

    const onChangePhone = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 11));
    }, []);

    const onSubmitForm = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        if (!name.trim()) { setVaild("이름을 입력해주세요."); return; }
        if (!phone.trim()) { setVaild("연락처를 입력해주세요."); return; }
        if (!/^[0-9]{10,11}$/.test(phone)) { setVaild("연락처는 숫자 10~11자리로 입력해주세요."); return; }
        if (!title.trim()) { setVaild("제목을 입력해주세요."); return; }
        if (!content.trim()) { setVaild("문의 내용을 입력해주세요."); return; }
        if (isSecret && !password.trim()) { setVaild("비밀글 비밀번호를 입력해주세요."); return; }

        const result = await create({
            source: "main",
            name: name.trim(),
            phone: phone.trim(),
            title: title.trim(),
            content: content.trim(),
            is_secret: isSecret,
            password_hash: isSecret ? password.trim() : null,
        });

        if (result) {
            router.push("/inquiry");
        } else {
            setVaild("문의 등록에 실패했습니다.");
        }
    }, [loading, name, phone, title, content, isSecret, password, create, router]);



    return (
        <>
            <CategoryBanner title="질문 & 답변" />
            <section>
                <div>
                    <Link href="/inquiry" className="text-sm text-muted hover:text-primary">
                        ← 목록으로
                    </Link>

                    <form onSubmit={onSubmitForm} className="mt-6 w-full">
                        <div className="flex items-start gap-2">
                            <span className="text-lg font-bold text-primary pc:text-2xl">Q</span>
                            <label htmlFor="inquiry-title" className="sr-only">제목</label>
                            <input
                                type="text"
                                id="inquiry-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="제목을 입력해주세요."
                                className="form-input flex-1 text-lg font-bold text-title pc:text-2xl"
                            />
                        </div>

                        <div className="mt-3 flex flex-col gap-3 pc:flex-row">
                            <div className="pc:w-40">
                                <label htmlFor="inquiry-name" className="sr-only">이름</label>
                                <input
                                    type="text"
                                    id="inquiry-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="이름"
                                    className="form-input w-full"
                                />
                            </div>
                            <div className="pc:w-56">
                                <label htmlFor="inquiry-phone" className="sr-only">연락처</label>
                                <input
                                    type="tel"
                                    id="inquiry-phone"
                                    inputMode="numeric"
                                    value={phone}
                                    onChange={onChangePhone}
                                    maxLength={11}
                                    placeholder="연락처 (숫자만 입력)"
                                    className="form-input w-full"
                                />
                            </div>
                        </div>

                        <div className="mt-4 border-t border-table-border" />

                        <div className="py-8 min-h-50">
                            <label htmlFor="inquiry-content" className="sr-only">문의 내용</label>
                            <textarea
                                id="inquiry-content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={8}
                                placeholder="문의하실 내용을 입력해주세요."
                                className="form-input w-full resize-none"
                            />
                        </div>

                        <div className="border-t border-table-border" />

                        <div className="mt-6 flex flex-col gap-3">
                            <label className="flex items-center gap-2 text-base text-muted">
                                <input
                                    type="checkbox"
                                    checked={isSecret}
                                    onChange={(e) => setIsSecret(e.target.checked)}
                                />
                                비밀글로 작성 (작성자와 관리자만 내용을 확인할 수 있어요)
                            </label>

                            {isSecret && (
                                <div>
                                    <label htmlFor="inquiry-password" className="sr-only">비밀글 비밀번호</label>
                                    <input
                                        type="password"
                                        id="inquiry-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="글 확인 시 사용할 비밀번호를 입력해주세요."
                                        className="form-input w-full pc:w-100"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <Link href="/inquiry" className="btn-ghost">
                                취소
                            </Link>
                            <button type="submit" disabled={loading} className="btn-primary">
                                {loading ? "등록 중..." : "등록"}
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            <Toast vaild={vaild} setVaild={setVaild} />
        </>
    );
}
