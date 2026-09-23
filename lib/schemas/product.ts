import { z } from "zod";
import { isProductCategory, type CategoryDef, type SpecFieldDef } from "@/datas/productCategories";

function getRequiredSpecFields(category: CategoryDef): SpecFieldDef[] {
    if (category.specSections.length === 0) return [];
    return category.specSections
        .filter((section) => section.title !== "편의기능" && !section.title.startsWith("분류"))
        .flatMap((section) => section.fields);
}

/**
 * 관리자 등록/수정 폼(ProductForm)에서 쓰는 스키마.
 * 카테고리마다 구조화 스펙 필드 구성이 달라서, 카테고리를 받아 그때그때 만든다.
 */
export function buildProductFormSchema(category: CategoryDef) {
    const usesStructuredSpecs = category.specSections.length > 0;
    const requiredSpecFields = getRequiredSpecFields(category);

    return z
        .object({
            name: z.string().trim().min(1, "상품명을 입력해주세요."),
            brand: z.string().trim().min(1, "브랜드를 입력해주세요."),
            price: z
                .string()
                .trim()
                .min(1, "가격을 숫자로 입력해주세요.")
                .refine((value) => Number.isFinite(Number(value)), "가격을 숫자로 입력해주세요."),
            discount_info: z.string().trim().min(1, "할인 안내를 입력해주세요."),
            is_popular: z.boolean(),
            popular_order: z
                .string()
                .refine((value) => value.trim() === "" || Number.isFinite(Number(value)), "숫자를 입력해주세요."),
            images: z.array(z.string()),
            specs: z.record(z.string(), z.string()),
            specsJsonText: z.string(),
        })
        .superRefine((data, ctx) => {
            if (usesStructuredSpecs) {
                for (const field of requiredSpecFields) {
                    if (!(data.specs[field.key] ?? "").trim()) {
                        ctx.addIssue({
                            code: "custom",
                            path: ["specs", field.key],
                            message: `${field.label}을(를) 입력해주세요.`,
                        });
                    }
                }
            } else if (data.specsJsonText.trim()) {
                try {
                    JSON.parse(data.specsJsonText);
                } catch {
                    ctx.addIssue({
                        code: "custom",
                        path: ["specsJsonText"],
                        message: "스펙(specs)이 올바른 JSON 형식이 아닙니다.",
                    });
                }
            }
        });
}

export type ProductFormValues = z.infer<ReturnType<typeof buildProductFormSchema>>;

/**
 * /api/products, /api/products/[id] 에서 쓰는 payload 스키마.
 * ProductForm이 이미 검증/변환을 마친 뒤 보내는 최종 값 형태(가격 등은 number)를 확인한다.
 */
export const productPayloadSchema = z.object({
    category: z.string().refine(isProductCategory, "카테고리를 선택해주세요."),
    name: z.string().trim().min(1, "상품명을 입력해주세요."),
    brand: z.string().trim().nullable().optional(),
    price: z.coerce.number().finite("가격을 입력해주세요."),
    discount_info: z.string().trim().nullable().optional(),
    images: z.array(z.string()).optional(),
    specs: z.record(z.string(), z.unknown()).nullable().optional(),
    price_options: z.array(z.unknown()).nullable().optional(),
    is_popular: z.coerce.boolean().optional(),
    popular_order: z.number().nullable().optional(),
    sort_order: z.number().optional(),
});
