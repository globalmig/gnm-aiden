import { supabaseClient } from "@/lib/supabaseClient";

// 관리자 API 호출용 fetch 래퍼: 로그인 세션이 있으면 Authorization 헤더를 붙여
// 서버 라우트의 관리자 인증 체크(requireAdmin)를 통과할 수 있게 한다.
// 세션이 없으면(비회원 문의 작성/조회 등) 헤더 없이 그대로 요청한다.
export async function authFetch(input: string, init: RequestInit = {}): Promise<Response> {
    const { data } = await supabaseClient.auth.getSession();
    const token = data.session?.access_token;

    if (!token) {
        return fetch(input, init);
    }

    const headers = new Headers(init.headers);
    headers.set("Authorization", `Bearer ${token}`);

    return fetch(input, { ...init, headers });
}
