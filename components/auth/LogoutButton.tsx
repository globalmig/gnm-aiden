"use client";
import { useCallback, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

export default function LogoutButton() {
    const [loading, setLoading] = useState(false);

    const onLogout = useCallback(async () => {
        if (loading) return;
        setLoading(true);
        await supabaseClient.auth.signOut();
        window.location.href = '/login';
    }, [loading]);

    return (
        <button
            onClick={onLogout}
            disabled={loading}
            className="text-base font-medium text-body hover:text-primary transition-colors disabled:opacity-50 cursor-pointer"
        >
            {loading ? "로그아웃 중..." : "로그아웃"}
        </button>
    );
}
