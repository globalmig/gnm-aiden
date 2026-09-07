"use client";

import { useActionState, useState } from "react";
import { submitLead, type LeadFormState } from "@/app/landing/actions";
import AgreementModal from "@/components/landing/AgreementModal";
import type { AgreementContent } from "@/datas/agreements";

const CATEGORY_OPTIONS: { value: string; label: string; icon: React.ReactNode }[] = [
  { value: "internet", label: "인터넷", icon: <WifiIcon /> },
  { value: "tv", label: "TV", icon: <TvIcon /> },
  { value: "combo", label: "인터넷+TV", icon: <ComboIcon /> },
];

const INITIAL_STATE: LeadFormState = { status: "idle" };

export default function LeadForm() {
  const [state, formAction, isPending] = useActionState(submitLead, INITIAL_STATE);
  const [category, setCategory] = useState("internet");
  const [bundleDiscountOptIn, setBundleDiscountOptIn] = useState(false);
  const [agreeCollection, setAgreeCollection] = useState(false);
  const [agreeThirdParty, setAgreeThirdParty] = useState(false);
  const [agreeAge, setAgreeAge] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [openModal, setOpenModal] = useState<AgreementContent["id"] | null>(null);

  const allAgreed = agreeCollection && agreeThirdParty && agreeAge && agreeMarketing;

  function toggleAll(checked: boolean) {
    setAgreeCollection(checked);
    setAgreeThirdParty(checked);
    setAgreeAge(checked);
    setAgreeMarketing(checked);
  }

  if (state.status === "success") {
    return (
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl pc:p-8">
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <CheckCircleIcon />
          <p className="text-lg font-bold text-gray-900">{state.message}</p>
          <p className="text-sm text-gray-500">담당자가 확인 후 순차적으로 연락드립니다.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <form action={formAction} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl pc:p-8">
        <h2 className="text-lg font-bold text-gray-900 pc:text-xl">
          오늘 받을 수 있는 <span className="text-blue-600">최대 혜택</span>,
          <br />
          1분 만에 확인해 보세요!
        </h2>

        <div className="mt-6 grid grid-cols-3 gap-2 pc:gap-3">
          {CATEGORY_OPTIONS.map((option) => (
            <CategoryCard
              key={option.value}
              icon={option.icon}
              label={option.label}
              value={option.value}
              selected={category === option.value}
              onSelect={() => setCategory(option.value)}
            />
          ))}
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <input
            type="checkbox"
            name="bundleDiscountOptIn"
            checked={bundleDiscountOptIn}
            onChange={(e) => setBundleDiscountOptIn(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          결합 할인 혜택 안내 받기
        </label>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-800">
              이름 <span className="text-blue-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="이름을 입력해주세요"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-800">
              휴대폰 번호 <span className="text-blue-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="휴대폰번호를 입력해주세요"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <input
              type="checkbox"
              checked={allAgreed}
              onChange={(e) => toggleAll(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
            />
            전체 동의
          </label>
          <ul className="mt-3 space-y-2.5 border-t border-gray-200 pt-3">
            <AgreementItem
              required
              name="agreeCollection"
              label="개인정보 수집 및 활용 동의"
              checked={agreeCollection}
              onChange={setAgreeCollection}
              onViewDetail={() => setOpenModal("collection")}
            />
            <AgreementItem
              required
              name="agreeThirdParty"
              label="개인정보 제3자 제공 및 활용 동의"
              checked={agreeThirdParty}
              onChange={setAgreeThirdParty}
              onViewDetail={() => setOpenModal("thirdParty")}
            />
            <AgreementItem
              required
              name="agreeAge"
              label="만 14세 이상입니다"
              checked={agreeAge}
              onChange={setAgreeAge}
            />
            <AgreementItem
              name="agreeMarketing"
              label="마케팅 정보 수신 동의"
              hint="혜택 및 이벤트 소식을 가장 먼저 알려드릴게요!"
              checked={agreeMarketing}
              onChange={setAgreeMarketing}
              onViewDetail={() => setOpenModal("marketing")}
            />
          </ul>
        </div>

        {state.status === "error" && (
          <p className="mt-4 text-sm font-medium text-red-500" role="alert">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isPending ? "접수 중..." : "내 맞춤 혜택 조회"}
        </button>
      </form>

      {openModal && <AgreementModal agreementId={openModal} onClose={() => setOpenModal(null)} />}
    </>
  );
}

function CategoryCard({
  icon,
  label,
  value,
  selected,
  onSelect,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <label
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border py-5 text-xs font-medium pc:text-sm ${
        selected ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-200 text-gray-500"
      }`}
    >
      <input
        type="radio"
        name="category"
        value={value}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />
      {icon}
      {label}
    </label>
  );
}

function AgreementItem({
  label,
  required,
  hint,
  name,
  checked,
  onChange,
  onViewDetail,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  onViewDetail?: () => void;
}) {
  return (
    <li>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          <span>
            <span className={required ? "text-blue-500" : "text-gray-400"}>
              {required ? "(필수)" : "(선택)"}
            </span>{" "}
            {label}
          </span>
        </label>
        {onViewDetail && (
          <button
            type="button"
            onClick={onViewDetail}
            aria-label={`${label} 자세히 보기`}
            className="p-1"
          >
            <ChevronRightIcon />
          </button>
        )}
      </div>
      {hint && <p className="mt-1 pl-6 text-xs text-blue-500">{hint}</p>}
    </li>
  );
}

function WifiIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M2 8.5c5.5-5 14.5-5 20 0" />
      <path d="M5.5 12.5c3.9-3.4 9.1-3.4 13 0" />
      <path d="M9 16.5c1.8-1.6 4.2-1.6 6 0" />
      <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TvIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 18v3" />
    </svg>
  );
}

function ComboIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="13" height="10" rx="2" />
      <path d="M18 5c2.5 1.8 2.5 5.2 0 7" />
      <path d="M20.5 3.5c3.5 2.8 3.5 8.2 0 11" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-gray-300" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-12 w-12 text-blue-600" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
