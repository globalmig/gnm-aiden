export default function CategoryBanner({ title }: { title: string }) {
  return (
    <main className="bg-surface w-full max-w-300 mt-16 px-5 py-8 mx-auto text-center pc:py-10 pc:mt-35 pc:-mb-14">
      <div>
        <h1 className="font-bold text-title">{title}</h1>
      </div>
    </main>
  );
}
