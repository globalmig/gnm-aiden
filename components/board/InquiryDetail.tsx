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
    <div className="w-full">
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

      <p className="mt-6 text-base font-semibold text-title">
        댓글 <span className="text-primary">{comments.length}</span>
      </p>

      {comments.length > 0 && (
        <div className="mt-4 space-y-3">
          {comments.map((comment) => {
            const isAuthorComment = comment.author === author;
            return (
              <div
                key={comment.id}
                className={`rounded-lg p-5 min-h-40 ${isAuthorComment ? "bg-[#eee]" : "bg-sky-light"}`}
              >
                <p className="text-base">
                  <span className="font-bold text-title">{comment.author}</span>
                  <span className="mx-2 text-muted">|</span>
                  <span className="text-muted">{formatDate(comment.createdAt)}</span>
                </p>
                <p className="mt-4 text-base">{comment.content}</p>
              </div>
            );
          })}
        </div>
      )}

      {canWriteComment && <div className="mt-8">{commentForm}</div>}
    </div>
  );
}
