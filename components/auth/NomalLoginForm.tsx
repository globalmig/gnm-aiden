"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Toast from "../ui/Toast";
import { supabaseClient } from "@/lib/supabaseClient";
import { loginSchema, type LoginFormValues } from "@/lib/schemas/login";

export default function NomalLoginForm() {
    // Supabase Auth 로그인 (관리자 계정은 공개 가입 없이 service role로만 발급됨)
    const router = useRouter();

    const [vaild, setVaild] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = handleSubmit(async (values) => {
        const { error } = await supabaseClient.auth.signInWithPassword(values);

        if (error) {
            setVaild("이메일 또는 비밀번호가 올바르지 않습니다.");
            reset({ email: "", password: "" });
            return;
        }

        // 로그인 성공 시 제품 관리 페이지로 이동
        router.push("/admin/products");
    });

    return (
        <>
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="form-label">이메일</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="이메일을 입력해주세요"
                        className="form-input"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="password" className="form-label">비밀번호</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="비밀번호를 입력해주세요"
                        className="form-input"
                        {...register("password")}
                    />
                    {errors.password && (
                        <p className="text-sm text-red-500">{errors.password.message}</p>
                    )}
                </div>
                <button type="submit" className="admin-btn-primary w-full" disabled={isSubmitting}>
                    {isSubmitting ? "로그인 중..." : "로그인"}
                </button>
            </form>
            <Toast vaild={vaild} setVaild={setVaild} />
        </>
    )
}
