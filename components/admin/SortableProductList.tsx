"use client";

import Image from "next/image";
import Link from "next/link";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    arrayMove,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Product } from "@/types/product";

function DragHandleIcon() {
    return (
        <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor" aria-hidden="true">
            <circle cx="7" cy="5" r="1.3" />
            <circle cx="13" cy="5" r="1.3" />
            <circle cx="7" cy="10" r="1.3" />
            <circle cx="13" cy="10" r="1.3" />
            <circle cx="7" cy="15" r="1.3" />
            <circle cx="13" cy="15" r="1.3" />
        </svg>
    );
}

function ProductCard({
    product,
    categoryValue,
    usesImages,
    dragDisabled,
    onDelete,
}: {
    product: Product;
    categoryValue: string;
    usesImages: boolean;
    dragDisabled: boolean;
    onDelete: (id: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: product.id,
        disabled: dragDisabled,
    });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
        zIndex: isDragging ? 10 : undefined,
    };
    const detailHref = `/admin/products/${categoryValue}/${product.id}`;
    const editHref = `${detailHref}/edit`;
    const thumbnail = product.images?.[0];

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
        >
            {!dragDisabled && (
                <button
                    type="button"
                    {...attributes}
                    {...listeners}
                    aria-label="드래그해서 순서 변경"
                    className="flex shrink-0 cursor-grab touch-none items-center justify-center rounded p-1 text-muted hover:bg-surface active:cursor-grabbing"
                >
                    <DragHandleIcon />
                </button>
            )}

            <Link href={detailHref} className="flex min-w-0 flex-1 items-center gap-4">
                {usesImages && (
                    <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface">
                        {thumbnail ? (
                            <Image src={thumbnail} alt="" width={64} height={64} className="h-full w-full object-cover" />
                        ) : (
                            <span className="text-[11px] text-muted">이미지 없음</span>
                        )}
                    </span>
                )}

                <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                        <span className="truncate text-base font-medium text-title">{product.name}</span>
                        {product.is_popular && (
                            <span className="inline-flex shrink-0 items-center rounded-full border border-primary/30 bg-white px-2 py-0.5 text-xs font-semibold text-primary">
                                인기
                            </span>
                        )}
                    </span>
                    <span className="mt-1 block text-sm text-muted">{product.brand || "-"}</span>
                </span>

                <span className="shrink-0 text-sm font-semibold text-title">{product.price.toLocaleString()}원</span>
            </Link>

            <div className="flex shrink-0 items-center justify-end gap-1.5">
                <Link href={editHref} className="admin-btn-ghost px-3 py-1.5 text-sm">
                    수정
                </Link>
                <button
                    type="button"
                    onClick={() => onDelete(product.id)}
                    className="admin-btn-ghost px-3 py-1.5 text-sm"
                >
                    삭제
                </button>
            </div>
        </div>
    );
}

interface SortableProductListProps {
    products: Product[];
    categoryValue: string;
    /** 카테고리가 이미지를 쓰지 않으면(예: 결합상품) 썸네일 영역을 아예 숨긴다. */
    usesImages: boolean;
    /** 검색 등으로 목록이 필터링된 상태면 드래그 정렬은 비활성화한다(전체 순서와 어긋나므로). */
    sortable: boolean;
    onReorder: (orderedIds: string[]) => void;
    onDelete: (id: string) => void;
}

export default function SortableProductList({ products, categoryValue, usesImages, sortable, onReorder, onDelete }: SortableProductListProps) {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        if (!sortable) return;
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = products.findIndex((product) => product.id === active.id);
        const newIndex = products.findIndex((product) => product.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        onReorder(arrayMove(products, oldIndex, newIndex).map((product) => product.id));
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={products.map((product) => product.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            categoryValue={categoryValue}
                            usesImages={usesImages}
                            dragDisabled={!sortable}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
