import type { ReactNode } from "react";
import { formatDate, maskAuthor } from "@/lib/format";

export interface InquiryComment {
  id: string | number;
  author: string;
  createdAt: string | Date;
  content: string;
}

interface InquiryDetailProps {
  title: string;
  author: string;
  createdAt: string | Date;
  content?: string;
  comments: InquiryComment[];
  canWriteComment?: boolean;
  commentForm?: ReactNode;
}

export default function InquiryDetail({
  title,
  author,
  createdAt,
  content,
  comments,
  canWriteComment = false,
  commentForm,
}: InquiryDetailProps) {
  return (
    <div className="w-full rounded-2xl border border-black/5 bg-white p-6 shadow-card pc:p-8">
      <div className="flex items-start gap-2">
        <span className="text-lg font-bold text-primary pc:text-2xl">Q</span>
        <h3 className="text-lg font-bold text-title pc:text-2xl">{title}</h3>
      </div>
      <p className="mt-2 text-base text-muted">
        {maskAuthor(author)}
        <span className="mx-2">|</span>
        {formatDate(createdAt)}
      </p>

      <div className="mt-4 border-t border-table-border" />

      <div className="py-8 min-h-50">
        <p className="whitespace-pre-line text-base">{content}</p>
      </div>

      <div className="border-t border-table-border" />

      <div className="mt-6 flex items-center gap-1.5">
        <ChatIcon />
        <p className="text-base font-semibold text-title">
          댓글 <span className="text-primary">{comments.length}</span>
        </p>
      </div>

      {comments.length > 0 && (
        <ul className="mt-4 space-y-4">
          {comments.map((comment) => {
            const isAdminComment = comment.author === "관리자";
            const displayName = isAdminComment ? comment.author : maskAuthor(comment.author);

            return (
              <li key={comment.id} className="flex items-start gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold pc:h-10 pc:w-10 ${
                    isAdminComment ? "bg-primary text-white" : "bg-surface text-title"
                  }`}
                  aria-hidden="true"
                >
                  {comment.author.slice(0, 1)}
                </div>

                <div
                  className={`min-w-0 flex-1 rounded-2xl border px-4 py-3.5 pc:px-5 pc:py-4 ${
                    isAdminComment ? "border-primary/15 bg-sky-light" : "border-table-border bg-white"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-sm font-semibold text-title pc:text-base">{displayName}</span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        isAdminComment ? "bg-primary text-white" : "border border-black/10 bg-white text-body"
                      }`}
                    >
                      {isAdminComment ? "관리자" : "문의자"}
                    </span>
                    <span className="text-xs text-muted pc:text-sm">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="mt-2 whitespace-pre-line text-sm text-body pc:text-base">{comment.content}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {canWriteComment && <div className="mt-8">{commentForm}</div>}
    </div>
  );
}

function ChatIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4 text-primary"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}
