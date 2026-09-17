import { Fragment } from "react";
import {
  BUNDLE_TYPE_OPTIONS,
  GIFT_ELIGIBLE_COMPANIES,
  SPEED_OPTIONS,
  formatGiftRange,
  formatPrice,
  getGiftRange,
  getPlans,
  type BundleType,
  type Company,
  type ProductType,
  type Speed,
} from "@/datas/internetPricing";

const PRODUCT_ROW_GROUPS: { productType: ProductType; label: string }[] = [
  { productType: "internet", label: "인터넷 단독" },
  { productType: "internet_tv", label: "인터넷 + TV" },
];

function PlanCell({
  company,
  productType,
  speed,
  bundleType,
}: {
  company: Company;
  productType: ProductType;
  speed: Speed;
  bundleType: BundleType;
}) {
  const plans = getPlans(company, productType, speed, bundleType);

  if (!plans) {
    return <td className="px-2 py-4 text-base">-</td>;
  }

  return (
    <td className="px-2 py-4 text-base">
      <div className="flex flex-col gap-2">
        {plans.map((plan) => (
          <div key={plan.planName}>
            {plans.length > 1 && <p className="text-xs font-semibold">{plan.planName}</p>}
            <p className="font-bold">{formatPrice(plan.price)}</p>
          </div>
        ))}
      </div>
    </td>
  );
}

export default function InternetPriceTable({ company }: { company: Company }) {
  const giftEligible = GIFT_ELIGIBLE_COMPANIES.includes(company);
  const colsPerSpeed = giftEligible ? 2 : 1;

  return (
    <div className="overflow-hidden border-t border-b border-table-border">
      <div className="table-scroll">
        <table className="w-full min-w-175 border-collapse text-center [&_tr>*:not(:last-child)]:border-r [&_tr>*:not(:last-child)]:border-table-border">
          <thead>
            <tr className="bg-table-head text-base">
              <th rowSpan={2} className="border-b border-table-border px-2 py-3 font-semibold">
                인터넷 상품
              </th>
              <th rowSpan={2} className="border-b border-table-border px-2 py-3 font-semibold">
                모바일 결합여부
              </th>
              {SPEED_OPTIONS.map((option) => (
                <th
                  key={option.value}
                  colSpan={colsPerSpeed}
                  className="border-b border-table-border px-2 py-3 font-semibold"
                >
                  {option.label}
                </th>
              ))}
            </tr>
            <tr className="bg-table-head">
              {SPEED_OPTIONS.map((option) => (
                <Fragment key={option.value}>
                  <th className="border-b border-table-border px-2 py-2 font-medium">요금</th>
                  {giftEligible && (
                    <th className="border-b border-table-border px-2 py-2 font-medium">사은품</th>
                  )}
                </Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {PRODUCT_ROW_GROUPS.map((group) =>
              BUNDLE_TYPE_OPTIONS.map((bundle, bundleIndex) => (
                <tr key={`${group.productType}-${bundle.value}`} className="border-b border-table-border">
                  {bundleIndex === 0 && (
                    <td
                      rowSpan={BUNDLE_TYPE_OPTIONS.length}
                      className="px-2 py-4 text-base font-semibold"
                    >
                      {group.label}
                    </td>
                  )}
                  <td className="px-2 py-4 text-base">{bundle.label}</td>
                  {SPEED_OPTIONS.map((option) => (
                    <Fragment key={option.value}>
                      <PlanCell
                        company={company}
                        productType={group.productType}
                        speed={option.value}
                        bundleType={bundle.value}
                      />
                      {giftEligible && bundleIndex === 0 && (
                        <td
                          rowSpan={BUNDLE_TYPE_OPTIONS.length}
                          className="px-2 py-4 text-base"
                        >
                          {formatGiftRange(getGiftRange(company, group.productType, option.value))}
                        </td>
                      )}
                    </Fragment>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
