"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/common/AdminHeader";
import SideMenu from "@/components/common/SideMenu";
import { supabaseClient } from "@/lib/supabaseClient";

// 개발 중 임시 조치: 어드민 로그인 검증을 건너뛰려면 false로 둔다. 배포 전 true로 되돌릴 것.
const REQUIRE_ADMIN_AUTH = true;

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [checking, setChecking] = useState(REQUIRE_ADMIN_AUTH);

    useEffect(() => {
        if (!REQUIRE_ADMIN_AUTH) return;

        supabaseClient.auth.getSession().then(({ data }) => {
            if (!data.session) {
                router.replace("/login");
                return;
            }
            setChecking(false);
        });
    }, [router]);

    if (checking) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-surface">
                <p className="text-base text-muted">확인 중...</p>
            </div>
        );
    }

    return (
        <>
            <AdminHeader />
            <div className="flex">
                <SideMenu />
                <div className="w-full min-h-screen overflow-auto bg-surface">
                    <div className="w-full max-w-300 p-20 mx-auto my-0 pc:px-0">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
