export interface InquiryReply {
    author: string;
    content: string;
    created_at: string;
}

// 랜딩페이지 리드 전용 필드. source가 "main"인 문의는 전부 null이다.
export interface LandingLeadFields {
    category: string | null;
    bundle_discount_opt_in: boolean | null;
    agree_collection: boolean | null;
    agree_third_party: boolean | null;
    agree_age: boolean | null;
}

export interface Inquiry extends LandingLeadFields {
    id: string;
    source: "main" | "landing";
    name: string;
    phone: string;
    title: string | null;
    content: string;
    is_secret: boolean;
    password_hash: string | null;
    status: "대기" | "답변완료";
    replies: InquiryReply[];
    created_at: string;
}

export interface InquiryInput extends Partial<LandingLeadFields> {
    source: "main" | "landing";
    name: string;
    phone: string;
    title: string | null;
    content: string;
    is_secret: boolean;
    /** 평문 비밀번호. 서버(`/api/inquiries` POST)에서 해싱 후 `password_hash`로 저장한다. */
    password: string | null;
}
