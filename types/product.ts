export interface Product {
    id: string;
    category: "internet" | "tv";
    name: string;
    brand: string | null;
    price: number;
    discount_info: string | null;
    images: string[];
    specs: Record<string, unknown>;
    price_options: unknown[];
    is_popular: boolean;
    popular_order: number | null;
    created_at: string;
    updated_at: string;
}

export type ProductInput = Omit<Product, "id" | "created_at" | "updated_at">;
