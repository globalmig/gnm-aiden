"use client";

import { COMPANY_INFO } from "@/datas/company";
import { USER_CATEGORY } from "@/datas/categories";
import Link from "next/link";
import { useState } from "react";

function getTopLevelHref(key: string) {
  if (key === "inquiry") return "/inquiry/write";
  return `/${key}`;
}
function getSubMenuHref(key: string, subUrl: string) {
  if (key === "tv") return `/tv?list=${subUrl}`;
  return `/${subUrl}`;
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-card">
        <div className="mx-auto flex h-16 max-w-300 items-center justify-between px-5 pc:px-0">
          <Link href="/" className="text-base font-bold text-title hover:text-primary">
            {COMPANY_INFO.name}
          </Link>

          <div className="pc:flex pc:items-center pc:gap-6">
            <nav
              className={`fixed top-0 right-0 z-50 h-dvh w-[75%] max-w-80 bg-white shadow-card duration-300 ease-in-out
                pc:static pc:h-auto pc:w-auto pc:max-w-none pc:translate-x-0 pc:shadow-none
                ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
              <div className="flex justify-end px-5 py-4 pc:hidden">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-xl leading-none text-title"
                  aria-label="메뉴 닫기"
                >
                  ✕
                </button>
              </div>

              <ul className="flex flex-col gap-1 px-5 pc:flex-row pc:items-center pc:gap-6 pc:px-0">
                {Object.entries(USER_CATEGORY).map(([key, category]) => {
                  const hasSubMenu = !!category.categories?.length;
                  return (
                    <li key={key} className="relative border-b border-gray-100 pc:border-0 last:border-0 group">
                      {hasSubMenu ? (
                        <p className="cursor-default py-3 text-sm font-medium text-body pc:py-5">
                          {category.title}
                        </p>
                      ) : (
                        <Link
                          href={getTopLevelHref(key)}
                          onClick={() => setIsOpen(false)}
                          className="block py-3 text-sm font-medium text-body hover:text-primary pc:py-5"
                        >
                          {category.title}
                        </Link>
                      )}
                      {hasSubMenu && (
                        <ul
                          className="flex flex-col gap-0.5 pb-2
                            pc:absolute pc:top-full pc:left-0 pc:z-50 pc:hidden pc:w-36 pc:rounded-lg pc:border pc:border-gray-100 pc:bg-white pc:py-1 pc:shadow-card pc:group-hover:block"
                        >
                          {category.categories!.map((sub) => (
                            <li key={sub.url}>
                              <Link
                                href={getSubMenuHref(key, sub.url)}
                                onClick={() => setIsOpen(false)}
                                className="block py-2 text-sm text-muted transition-colors hover:text-primary pc:px-4 pc:py-2.5 pc:hover:bg-surface"
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
            </nav>

            <div className="flex items-center gap-4 pc:gap-6">
              <Link href="/landing" className="btn-primary hidden px-3 py-1.5 text-sm pc:inline-flex">
                상담 신청
              </Link>

              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="flex h-5 w-6 shrink-0 flex-col justify-center gap-1 pc:hidden"
                aria-label="메뉴 열기"
              >
                <span className="block h-0.5 w-full rounded-full bg-title" />
                <span className="block h-0.5 w-full rounded-full bg-title" />
                <span className="block h-0.5 w-full rounded-full bg-title" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 pc:hidden
          ${isOpen ? "visible opacity-100" : "invisible opacity-0"}`}
        onClick={() => setIsOpen(false)}
      />
    </>
  );
}
