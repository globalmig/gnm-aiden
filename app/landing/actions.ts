"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export interface LeadFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

const CATEGORIES = new Set(["internet", "tv", "combo"]);
const PHONE_REGEX = /^01[0-9]-?\d{3,4}-?\d{4}$/;

export async function submitLead(_prevState: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const category = String(formData.get("category") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const bundleDiscountOptIn = formData.get("bundleDiscountOptIn") === "on";
  const agreeCollection = formData.get("agreeCollection") === "on";
  const agreeThirdParty = formData.get("agreeThirdParty") === "on";
  const agreeAge = formData.get("agreeAge") === "on";
  const agreeMarketing = formData.get("agreeMarketing") === "on";

  if (!CATEGORIES.has(category)) {
    return { status: "error", message: "상품 카테고리를 선택해주세요." };
  }
  if (!name) {
    return { status: "error", message: "이름을 입력해주세요." };
  }
  if (!PHONE_REGEX.test(phone)) {
    return { status: "error", message: "휴대폰번호 형식을 확인해주세요." };
  }
  if (!agreeCollection || !agreeThirdParty || !agreeAge) {
    return { status: "error", message: "필수 동의 항목에 모두 동의해주세요." };
  }

  const { error } = await supabaseAdmin.from("leads").insert({
    category,
    name,
    phone,
    bundle_discount_opt_in: bundleDiscountOptIn,
    agree_collection: agreeCollection,
    agree_third_party: agreeThirdParty,
    agree_age: agreeAge,
    agree_marketing: agreeMarketing,
  });

  if (error) {
    return { status: "error", message: "접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }

  return { status: "success", message: "상담 신청이 접수되었습니다. 곧 연락드리겠습니다!" };
}
