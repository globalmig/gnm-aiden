import "./globals.css";
import { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import localFont from "next/font/local";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
});

const esamanruMedium = localFont({
  src: "../public/fonts/esamanru Medium.ttf",
  variable: "--font-esamanru-medium",
});

export const metadata: Metadata = {
  title: "",
  description: "",
  keywords: [
   "",
  ],
  openGraph: {
    title: "",
    description: "",
    url: "",
    siteName: "",
    images: [
      {
        url: ``,
        width: 1200,
        height: 630,
        alt: "",
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  other: {
    'naver-site-verification': 'search- advider',
  }
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${notoSansKr.variable} ${esamanruMedium.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
