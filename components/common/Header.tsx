"use client";

import { USER_CATEGORY } from "@/datas/categories";
import Link from "next/link";
import { useEffect, useState } from "react";

function getTopLevelHref(key: string) {
  return `/${key}`;
}
function getSubMenuHref(key: string, subUrl: string) {
  if (key === "tv") return `/tv?list=${subUrl}`;
  if (key === "internet") return `/internet?company=${subUrl}`;
  return `/${subUrl}`;
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  );
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubKey, setOpenSubKey] = useState<string | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setOpenSubKey(null);
      return;
    }
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  const hoveredCategory = hoveredKey ? USER_CATEGORY[hoveredKey] : null;

  return (
    <>
      <header
        className="fixed w-full top-0 z-100 border-b border-gray-100 bg-white"
        onMouseLeave={() => setHoveredKey(null)}
      >
        <div className="mx-auto flex h-16 max-w-300 items-center justify-between px-5 pc:h-20 pc:px-0">
          <Link
            href="/"
            onClick={closeMenu}
            className="shrink-0 text-xl font-extrabold tracking-tight text-primary pc:text-2xl"
          >
            지앤엠
          </Link>

          <div className="flex items-center gap-2 pc:gap-8">
            <nav
              id="gnb"
              className={`fixed inset-y-0 right-0 z-100 flex w-[80%] max-w-80 flex-col bg-white duration-300 ease-in-out
                pc:static pc:w-auto pc:max-w-none pc:translate-x-0 pc:flex-row
                ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 pc:hidden">
                <span className="text-base font-semibold text-title">메뉴</span>
                <button
                  type="button"
                  onClick={closeMenu}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-title active:bg-surface"
                  aria-label="메뉴 닫기"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>

              <ul className="flex flex-1 flex-col overflow-y-auto px-2 py-2 pc:flex-none pc:flex-row pc:items-center pc:gap-8 pc:overflow-visible pc:px-0 pc:py-0">
                {Object.entries(USER_CATEGORY).map(([key, category]) => {
                  const hasSubMenu = !!category.categories?.length;
                  const isSubOpen = openSubKey === key;
                  return (
                    <li
                      key={key}
                      className="border-b border-gray-50 pc:border-0"
                      onMouseEnter={() => setHoveredKey(hasSubMenu ? key : null)}
                    >
                      {hasSubMenu ? (
                        <div className="flex w-full items-center justify-between pc:w-auto pc:gap-1">
                          <Link
                            href={getTopLevelHref(key)}
                            onClick={closeMenu}
                            onFocus={() => setHoveredKey(key)}
                            className="flex-1 px-3 py-3.5 text-left text-base font-medium text-body pc:flex-none pc:px-0 pc:py-6 pc:text-base pc:hover:text-primary"
                          >
                            {category.title}
                          </Link>
                          <button
                            type="button"
                            onClick={() => setOpenSubKey(isSubOpen ? null : key)}
                            aria-expanded={isSubOpen}
                            aria-label={`${category.title} 하위메뉴 ${isSubOpen ? "닫기" : "열기"}`}
                            className="flex h-11 w-11 shrink-0 items-center justify-center pc:hidden"
                          >
                            <ChevronIcon
                              className={`h-4 w-4 rotate-90 text-muted transition-transform duration-200 ${
                                isSubOpen ? "-rotate-90" : ""
                              }`}
                            />
                          </button>
                        </div>
                      ) : (
                        <Link
                          href={getTopLevelHref(key)}
                          onClick={closeMenu}
                          className="block px-3 py-3.5 text-base font-medium text-body hover:text-primary pc:px-0 pc:py-6 pc:text-base"
                        >
                          {category.title}
                        </Link>
                      )}

                      {hasSubMenu && (
                        <ul
                          className={`overflow-hidden text-base transition-[max-height] duration-200 ease-in-out pc:hidden
                            ${isSubOpen ? "max-h-62.5" : "max-h-0"}`}
                        >
                          {category.categories!.map((sub) => (
                            <li key={sub.url}>
                              <Link
                                href={getSubMenuHref(key, sub.url)}
                                onClick={closeMenu}
                                className="block bg-surface/60 px-6 py-2.5 text-muted transition-colors hover:text-primary"
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="border-t border-gray-100 p-5 pc:hidden">
                <Link href="/inquiry/write" onClick={closeMenu} className="bg-primary text-white block w-full py-3 text-center text-base">
                  간편 상담 신청
                </Link>
              </div>
            </nav>

            <Link href="/inquiry/write" className="btn-primary hidden px-4 py-2 text-base pc:inline-flex rounded-full">
              간편 상담 신청
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="메뉴 열기"
              aria-expanded={isOpen}
              aria-controls="gnb"
              className="flex h-10 w-10 shrink-0 items-center justify-center pc:hidden"
            >
              <MenuIcon className="h-6 w-6 text-title" />
            </button>
          </div>
        </div>

        {/* PC 전용: 메인 메뉴 hover 시 펼쳐지는 서브메뉴 */}
        {hoveredCategory?.categories && (
          <div className="absolute inset-x-0 top-full hidden border-t border-gray-100 bg-white pc:block">
            <ul className="mx-auto flex max-w-300 items-center gap-8 px-0 py-4">
              {hoveredCategory.categories.map((sub) => (
                <li key={sub.url}>
                  <Link
                    href={getSubMenuHref(hoveredKey!, sub.url)}
                    onClick={closeMenu}
                    className="text-base text-body transition-colors hover:text-primary"
                  >
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      <div
        aria-hidden="true"
        onClick={closeMenu}
        className={`fixed inset-0 z-90 bg-black/50 transition-opacity duration-300 pc:hidden
          ${isOpen ? "visible opacity-100" : "invisible opacity-0"}`}
      />
    </>
  );
}
