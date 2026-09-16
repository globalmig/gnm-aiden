"use client";

import { useEffect, useRef, useState } from "react";

export function useInfiniteScroll(totalCount: number, pageSize: number) {
  const [visibleCount, setVisibleCount] = useState(Math.min(pageSize, totalCount));
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + pageSize, totalCount));
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [pageSize, totalCount]);

  return { visibleCount, sentinelRef };
}
