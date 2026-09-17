import Image from "next/image";
import Link from "next/link";
import { formatDate, isToday } from "@/lib/format";

export interface NoticeBoardItem {
  id: string | number;
  title: string;
  createdAt: string | Date;
  isPinned?: boolean;
}

interface NoticeBoardProps {
  items: NoticeBoardItem[];
  detailBasePath?: string;
}

export default function NoticeBoard({ items, detailBasePath = "/notice" }: NoticeBoardProps) {
  return (
    <div className="w-full table-scroll">
      <table className="w-full min-w-0 border-collapse text-left pc:min-w-150">
        <thead className="hidden pc:table-header-group">
          <tr className="bg-table-head border-b border-b-primary/50 text-base text-title">
            <th className="px-4 py-4 pc:px-6">제목</th>
            <th className="w-28 px-4 py-4 text-center pc:w-40">작성일</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr className="block pc:table-row">
              <td colSpan={2} className="block px-4 py-16 text-center text-base text-muted pc:table-cell">
                등록된 공지사항이 없습니다.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr
                key={item.id}
                className={`block border-b border-table-border py-3 text-base text-body pc:table-row pc:py-0 ${
                  item.isPinned ? "bg-gray-50" : ""
                }`}
              >
                <td className="block min-w-0 px-4 py-1 pc:table-cell pc:px-6 pc:py-4">
                  <Link
                    href={`${detailBasePath}/${item.id}`}
                    className="flex min-w-0 items-center gap-2 hover:text-primary"
                  >
                    {item.isPinned && (
                      <span className="inline-flex shrink-0 items-center rounded-full border border-primary/30 bg-white px-2 py-0.5 text-xs font-semibold text-primary">
                        중요
                      </span>
                    )}
                    <span className="truncate text-title text-base">{item.title}</span>

                    {!item.isPinned && isToday(item.createdAt) && (
                      <Image
                        src="/icons/icon-new-contents.svg"
                        alt="신규 공지"
                        width={17}
                        height={17}
                        className="shrink-0"
                      />
                    )}
                  </Link>
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
