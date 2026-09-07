import LeadForm from "@/components/landing/LeadForm";

export default function LandingPage() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-blue-600">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-12 px-5 py-16 pc:flex-row pc:items-center pc:gap-20 pc:px-0">
        {/* 좌측 헤드라인 영역 */}
        <div className="w-full pc:w-1/2">
          <p className="text-lg font-medium text-blue-100 pc:text-xl">몰라서 놓쳤던</p>
          <h1 className="mt-2 text-3xl font-bold leading-snug text-white pc:text-5xl">
            지원금은 <span className="text-yellow-300">최대로,</span>
            <br />
            월 요금은 가볍게!
          </h1>
        </div>

        {/* 우측 폼 카드 */}
        <LeadForm />
      </div>
    </section>
  );
}
