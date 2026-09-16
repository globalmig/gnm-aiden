import Image from "next/image";
import Link from "next/link";
import { formatDate, isToday, maskAuthor } from "@/lib/format";

export interface InquiryBoardItem {
  id: string | number;
  title: string;
  author: string;
  createdAt: string | Date;
  commentCount: number;
  isSecret?: boolean;
}

interface InquiryBoardProps {
  items: InquiryBoardItem[];
  detailBasePath?: string;
}

export default function InquiryBoard({ items, detailBasePath = "/inquiry" }: InquiryBoardProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-0 border-collapse text-left pc:min-w-150">
        <thead className="hidden pc:table-header-group">
          <tr className="bg-table-head text-base text-title">
            <th className="px-4 py-4 pc:px-6">제목</th>
            <th className="w-28 px-4 py-4 text-center pc:w-40">작성자</th>
            <th className="w-28 px-4 py-4 text-center pc:w-40">작성일</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr className="block pc:table-row">
              <td colSpan={3} className="block px-4 py-16 text-center text-base text-muted pc:table-cell">
                등록된 문의가 없습니다.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr
                key={item.id}
                className="block border-b border-table-border py-3 text-base text-body pc:table-row pc:py-0"
              >
                <td className="block min-w-0 px-4 py-1 pc:table-cell pc:px-6 pc:py-4">
                  <Link
                    href={`${detailBasePath}/${item.id}`}
                    className="flex min-w-0 items-center gap-2 hover:text-primary"
                  >
                    <span className="truncate text-title text-base">{item.title}</span>

                    {item.isSecret && (
                      <Image src="/icons/icon-lock.svg" alt="비밀글" width={11} height={13} className="shrink-0" />
                    )}

                    <span className="flex shrink-0 items-center gap-1 text-xs text-muted">
                      <Image src="/icons/icon-comment.svg" alt="댓글" width={16} height={15} />
                      {item.commentCount}
                    </span>

                    {isToday(item.createdAt) && (
                      <Image
                        src="/icons/icon-new-contents.svg"
                        alt="신규 문의"
                        width={17}
                        height={17}
                        className="shrink-0"
                      />
                    )}
                  </Link>
                </td>
                <td className="inline-block text-muted pc:text-body px-4 py-1 text-left pc:table-cell pc:px-4 pc:py-4 pc:text-center">
                  {maskAuthor(item.author)}
                </td>
                <td className="inline-block px-4 py-1 text-left text-muted pc:table-cell pc:px-4 pc:py-4 pc:text-center pc:text-body">
                  {formatDate(item.createdAt)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
