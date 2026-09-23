import { notFound } from "next/navigation";
import { GUIDE_CATEGORIES, isGuideCategory } from "@/datas/guideCategories";
import { GUIDE_CONTENT } from "@/datas/guideContent";

export default async function AdminGuideCategoryPage({
    params,
}: {
    params: Promise<{ category: string }>;
}) {
    const { category } = await params;
    if (!isGuideCategory(category)) notFound();

    const meta = GUIDE_CATEGORIES.find((item) => item.value === category)!;
    const content = GUIDE_CONTENT[category];

    return (
        <div className="card p-6 md:p-8">
            <h1 className="text-lg font-bold text-title">{meta.label} 가이드</h1>

            {!content ? (
                <p className="mt-2 text-base text-body">준비 중입니다.</p>
            ) : (
                <div className="mt-4 space-y-8">
                    <p className="text-base text-body">{content.summary}</p>

                    {content.sections.map((section) => (
                        <section key={section.title}>
                            <h2 className="text-base font-bold text-title">{section.title}</h2>
                            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-body">
                                {section.items.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </section>
                    ))}

                    {content.notes && content.notes.length > 0 && (
                        <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-700">
                            <p className="font-semibold">유의사항</p>
                            <ul className="mt-1.5 list-disc space-y-1 pl-5">
                                {content.notes.map((note, i) => (
                                    <li key={i}>{note}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
