import "react-quill-new/dist/quill.snow.css";
import { formatDate } from "@/lib/format";

interface NoticeDetailProps {
  title: string;
  createdAt: string | Date;
  content: string;
}

export default function NoticeDetail({ title, createdAt, content }: NoticeDetailProps) {
  return (
    <div className="w-full">
      <h3 className="text-lg font-bold text-title pc:text-2xl">{title}</h3>
      <p className="mt-2 text-base text-muted">{formatDate(createdAt)}</p>
      <div className="mt-4 border-t border-table-border" />
      <div className="py-8 min-h-50">
        <div className="ql-editor p-0! text-base text-body" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}
