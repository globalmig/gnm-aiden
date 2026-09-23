import { z } from "zod";

export const noticeSchema = z.object({
    title: z.string().trim().min(1, "제목을 입력해주세요."),
    content: z
        .string()
        .refine((value) => value.replace(/<[^>]*>/g, "").trim().length > 0, {
            message: "내용을 입력해주세요.",
        }),
    is_pinned: z.boolean(),
});

export type NoticeFormValues = z.infer<typeof noticeSchema>;
