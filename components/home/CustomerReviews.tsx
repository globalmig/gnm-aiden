import Image from "next/image";

type Review = {
  id: string;
  rating: number;
  title: string;
  content: string;
  author: string;
};

const REVIEWS: Review[] = [
  {
    id: "review-1",
    rating: 5,
    title: "비싼 요금제 강요 없이, 딱 필요한 것만 추천해 줍니다.",
    content:
      "다른 사이트에서는 자꾸 1G 고가 요금제랑 부가서비스를 권해서 부담스러웠거든요.\n여기는 1인 가구인 제 사용 패턴에 맞춰 100M 요금제로 깔끔하게 안내해 주셔서 좋았습니다.",
    author: "박*희 님 (SKT 인터넷 단독)",
  },
  {
    id: "review-2",
    rating: 5,
    title: "알뜰폰 유저라 할인 포기했었는데, 맞춤 결합을 찾아주셨어요.",
    content:
      "알뜰폰을 쓰고 있어서 결합 할인은 기대도 안 했는데, 상담원분이 제 통신사 망에 맞춰서\n제일 알뜰한 결합 상품을 안내해 주셨어요. 덕분에 매달 나가는 통신비가 확 줄었습니다!",
    author: "이*우 님 (KT 500M 결합 가입)",
  },
  {
    id: "review-3",
    rating: 5,
    title: "신혼집 이사 날짜에 맞춰서 깔끔하게 설치 끝냈습니다.",
    content:
      "이사 날짜가 타이트해서 설치가 늦어질까 봐 걱정했는데, 원하는 시간대에 딱 맞게 엔지니어\n기사님 방문 예약을 잡아주셨어요. 신혼부부 전용 할인 혜택까지 챙겨받았습니다!",
    author: "정*아 님 (LGU+ 인터넷+TV 가입)",
  },
];

function ReviewCard({ review, className = "" }: { review: Review; className?: string }) {
  return (
    <div className={`card w-full rounded-2xl px-8 py-10 ${className}`}>
      <div className="flex gap-1">
        {Array.from({ length: review.rating }).map((_, i) => (
          <Image key={i} src="/icons/icon-star.svg" alt="" width={20} height={19} />
        ))}
      </div>
      <p className="mt-4 text-lg font-bold text-title">{review.title}</p>
      <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-body">{review.content}</p>
      <span className="mt-6 inline-flex items-center rounded-full bg-sky-light px-4 py-2 text-base font-medium text-primary">
        {review.author}
      </span>
    </div>
  );
}

export default function CustomerReviews() {
  const [review1, review2, review3] = REVIEWS;

  return (
    <section>
      <div className="relative">

        <h2 className="text-center font-bold text-title">실제 이용 고객님들의 솔직한 후기</h2>
        <p className="mt-3 text-center text-body">가입 과정부터 사은품 지급까지, 직접 경험한 이야기를 확인하세요.</p>

        {/* 모바일: w-full, flex-col */}
        <div className="mt-10 w-full gap-6 pc:hidden">
          <ReviewCard review={review1} />
          <ReviewCard review={review3} />
          <ReviewCard review={review2} />
        </div>

        {/* PC: 2열 스태거드 레이아웃 */}
        <div className="hidden pc:mt-20 pc:grid pc:grid-cols-2 pc:gap-x-11 pc:gap-y-8">
          <div className="relative">
            <Image
              src="/images/큰따옴표1.png"
              alt=""
              width={44}
              height={37}
              className="absolute -top-4 left-5"
            />
            <ReviewCard review={review1} />
          </div>
          <div className="relative pc:row-span-2 pc:self-center">
            <Image
              src="/images/큰따옴표2.png"
              alt=""
              width={44}
              height={37}
              className="absolute right-5 bottom-15"
            />
            <ReviewCard review={review2} className="pc:mb-20" />
          </div>
          <ReviewCard review={review3} className="pc:ml-30 pc:mt-2" />
        </div>
      </div>
    </section>

  );
}
