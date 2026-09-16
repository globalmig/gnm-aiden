export interface InquiryReply {
    author: string;
    content: string;
    created_at: string;
}

export interface Inquiry {
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

export interface InquiryInput {
    source: "main" | "landing";
    name: string;
    phone: string;
    title: string | null;
    content: string;
    is_secret: boolean;
    password_hash: string | null;
}
