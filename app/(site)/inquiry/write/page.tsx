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
        if (!password.trim()) { setVaild("비밀글 비밀번호를 입력해주세요."); return; }

        const result = await create({
            source: "main",
            name: name.trim(),
            phone: phone.trim(),
            title: title.trim(),
            content: content.trim(),
            is_secret: true,
            password: password.trim(),
        });

        if (result) {
            router.push("/inquiry");
        } else {
            setVaild("문의 등록에 실패했습니다.");
        }
    }, [loading, name, phone, title, content, password, create, router]);



    return (
        <>
            <CategoryBanner title="질문 & 답변" />
            <section>
                <div>
                    <Link
                        href="/inquiry"
                        className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-primary"
                    >
                        <span aria-hidden>←</span> 목록으로
                    </Link>

                    <form onSubmit={onSubmitForm} className="mt-6 w-full">
                        <div className="border-t border-[#eee]">
                            <FormRow label="제목" htmlFor="inquiry-title" required>
                                <input
                                    type="text"
                                    id="inquiry-title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="제목을 입력해주세요."
                                    className="table-input"
                                />
                            </FormRow>

                            <FormRow label="이름" htmlFor="inquiry-name" required>
                                <input
                                    type="text"
                                    id="inquiry-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="이름을 입력해주세요."
                                    className="table-input"
                                />
                            </FormRow>

                            <FormRow label="연락처" htmlFor="inquiry-phone" required>
                                <input
                                    type="tel"
                                    id="inquiry-phone"
                                    inputMode="numeric"
                                    value={phone}
                                    onChange={onChangePhone}
                                    maxLength={11}
                                    placeholder="연락처 (숫자만 입력)"
                                    className="table-input"
                                />
                            </FormRow>

                            <FormRow label="문의 내용" htmlFor="inquiry-content" required align="start">
                                <textarea
                                    id="inquiry-content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={7}
                                    placeholder="문의하실 내용을 입력해주세요."
                                    className="table-input resize-none py-3"
                                />
                            </FormRow>

                            <FormRow label="비밀글">
                                <label className="flex items-center gap-2 px-4 py-2.5 text-sm text-body">
                                    <input
                                        type="checkbox"
                                        checked
                                        disabled
                                        className="size-4 accent-primary"
                                    />
                                    작성자와 관리자만 내용을 확인할 수 있어요.
                                </label>
                            </FormRow>

                            <FormRow label="비밀번호" htmlFor="inquiry-password" required>
                                <input
                                    type="password"
                                    id="inquiry-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="글 확인 시 사용할 비밀번호를 입력해주세요."
                                    className="table-input"
                                />
                            </FormRow>
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

function FormRow({
    label,
    htmlFor,
    required,
    align = "center",
    children,
}: {
    label: string;
    htmlFor?: string;
    required?: boolean;
    align?: "center" | "start";
    children: React.ReactNode;
}) {
    const isStart = align === "start";

    return (
        <div className="flex border-b border-table-border">
            <label
                htmlFor={htmlFor}
                className={`flex w-24 shrink-0 justify-start bg-sky-light px-2 text-left text-sm font-semibold text-title pc:w-40 pc:text-base ${
                    isStart ? "items-start pt-3" : "items-center"
                }`}
            >
                {label}
                {required && <span className="ml-0.5 text-primary">*</span>}
            </label>
            <div className={`flex flex-1 ${isStart ? "items-start" : "items-center"}`}>{children}</div>
        </div>
    );
}
