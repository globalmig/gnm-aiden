import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/apiAuth";
import { DEFAULT_INTERNET_PRICING_CONFIG, type InternetPricingConfig } from "@/datas/internetPricing";

const SETTINGS_KEY = "internet_pricing";

function isValidConfig(value: unknown): value is InternetPricingConfig {
    if (!value || typeof value !== "object") return false;
    const config = value as Record<string, unknown>;
    return (
        typeof config.plans === "object" && config.plans !== null &&
        typeof config.giftTable === "object" && config.giftTable !== null &&
        typeof config.usimExtraGift === "object" && config.usimExtraGift !== null
    );
}

// 공개 API: 인증 없이 /internet 페이지가 직접 호출한다.
// site_settings에 값이 없거나(첫 배포) 조회에 실패해도 기본값을 반환해 공개 페이지가 절대 깨지지 않게 한다.
export async function GET() {
    const { data } = await supabaseAdmin
        .from("site_settings")
        .select("value")
        .eq("key", SETTINGS_KEY)
        .maybeSingle();

    return NextResponse.json({ data: (data?.value as InternetPricingConfig | undefined) ?? DEFAULT_INTERNET_PRICING_CONFIG });
}

export async function PATCH(request: NextRequest) {
    const unauthorized = await requireAdmin(request);
    if (unauthorized) return unauthorized;

    const body = await request.json();
    if (!isValidConfig(body)) {
        return NextResponse.json({ error: "요금 데이터 형식이 올바르지 않습니다." }, { status: 400 });
    }

    const { error } = await supabaseAdmin
        .from("site_settings")
        .upsert({ key: SETTINGS_KEY, value: body, updated_at: new Date().toISOString() });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: body });
}
