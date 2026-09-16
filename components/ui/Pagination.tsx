import { useState } from "react";

interface IPaginationProps {
  totalCount: number;
  itemsPerPage: number;
  pagesPerGroup?: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  totalCount,
  itemsPerPage,
  pagesPerGroup = 5,
  onPageChange,
}: IPaginationProps) {

  const pageCount = Math.ceil(totalCount / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [groupStart, setGroupStart] = useState(1);

  const pages = Array.from(
    { length: pagesPerGroup },
    (_, i) => i + groupStart
  ).filter((page) => page <= pageCount);

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const handlePrev = () => {
    if (currentPage <= 1) return;
    const newPage = currentPage - 1;
    if (newPage < groupStart) setGroupStart(groupStart - pagesPerGroup);
    handlePageClick(newPage);
  };

  const handleNext = () => {
    if (currentPage >= pageCount) return;
    const newPage = currentPage + 1;
    if (newPage >= groupStart + pagesPerGroup) setGroupStart(groupStart + pagesPerGroup);
    handlePageClick(newPage);
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-10 pc:mt-20">
      <button
        onClick={handlePrev}
        disabled={currentPage <= 1}
        aria-label="이전 페이지"
        className="w-8 h-8 flex items-center justify-center rounded-lg text-body hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5 text-[#aaa]">
          <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 4.5-7.5 7.5 7.5 7.5" />
        </svg>
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-base font-medium transition-colors cursor-pointer ${
            currentPage === page
              ? "bg-table-head text-body"
              : "text-body hover:bg-surface"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={handleNext}
        disabled={currentPage >= pageCount}
        aria-label="다음 페이지"
        className="w-8 h-8 flex items-center justify-center rounded-lg text-body hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5 text-[#aaa]">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}
