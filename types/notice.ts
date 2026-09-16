export interface Notice {
    id: string;
    title: string;
    content: string;
    is_pinned: boolean;
    created_at: string;
    updated_at: string;
}

export interface NoticeInput {
    title: string;
    content: string;
    is_pinned?: boolean;
}
