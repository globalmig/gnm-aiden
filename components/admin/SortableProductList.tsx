"use client";

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

function ProductRow({
    product,
    categoryValue,
    dragDisabled,
    onDelete,
}: {
    product: Product;
    categoryValue: string;
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
    const editHref = `/admin/products/${categoryValue}/${product.id}/edit`;

    return (
        <tr ref={setNodeRef} style={style} className="border-b border-table-border text-base text-body">
            <td className="w-10 px-2 py-3 text-center">
                {!dragDisabled && (
                    <button
                        type="button"
                        {...attributes}
                        {...listeners}
                        aria-label="드래그해서 순서 변경"
                        className="cursor-grab touch-none rounded p-1 text-muted hover:bg-surface active:cursor-grabbing"
                    >
                        <DragHandleIcon />
                    </button>
                )}
            </td>
            <td className="min-w-0 px-3 py-3">
                <Link href={editHref} className="flex min-w-0 items-center gap-2 hover:text-primary">
                    <span className="truncate text-base font-medium text-title">{product.name}</span>
                    {product.is_popular && (
                        <span className="inline-flex shrink-0 items-center rounded-full border border-primary/30 bg-white px-2 py-0.5 text-xs font-semibold text-primary">
                            인기
                        </span>
                    )}
                </Link>
            </td>
            <td className="px-3 py-3 text-center text-sm text-muted">{product.brand || "-"}</td>
            <td className="px-3 py-3 text-center text-sm font-semibold text-title">
                {product.price.toLocaleString()}원
            </td>
            <td className="px-3 py-3">
                <div className="flex items-center justify-center gap-1.5">
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
            </td>
        </tr>
    );
}

interface SortableProductListProps {
    products: Product[];
    categoryValue: string;
    /** 검색 등으로 목록이 필터링된 상태면 드래그 정렬은 비활성화한다(전체 순서와 어긋나므로). */
    sortable: boolean;
    onReorder: (orderedIds: string[]) => void;
    onDelete: (id: string) => void;
}

export default function SortableProductList({ products, categoryValue, sortable, onReorder, onDelete }: SortableProductListProps) {
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
        <div className="table-scroll">
            <table className="w-full min-w-150 border-collapse text-left">
                <thead>
                    <tr className="border-b border-b-primary/50 bg-table-head text-base text-title">
                        <th className="w-10 px-2 py-3" aria-hidden="true" />
                        <th className="px-3 py-3 font-semibold">상품명</th>
                        <th className="px-3 py-3 text-center font-semibold">브랜드</th>
                        <th className="px-3 py-3 text-center font-semibold">가격</th>
                        <th className="px-3 py-3 text-center font-semibold">관리</th>
                    </tr>
                </thead>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={products.map((product) => product.id)} strategy={verticalListSortingStrategy}>
                        <tbody>
                            {products.map((product) => (
                                <ProductRow
                                    key={product.id}
                                    product={product}
                                    categoryValue={categoryValue}
                                    dragDisabled={!sortable}
                                    onDelete={onDelete}
                                />
                            ))}
                        </tbody>
                    </SortableContext>
                </DndContext>
            </table>
        </div>
    );
}
