import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// GOOGLE VA IJTIMOIY TARMOQLAR UCHUN METADATA
export const metadata: Metadata = {
  // Saytingizning asosiy manzili
  metadataBase: new URL("https://uz-manga-pro.vercel.app"),
  
  // Qidiruv natijasida chiqadigan sarlavha
  title: {
    default: "Uz-Manga | Eng sara mangalar va dunxualar",
    template: "%s | Uz-Manga",
  },
  
  // Sayt haqida qisqacha ma'lumot
  description: "O'zbek tilidagi eng yaxshi manga va manxva. Sevimli asarlaringizni o'zbek tilida o'qing.",
  
  // Kalit so'zlar
  keywords: ["manga", "manxva", "manxua", "uzbekcha manga", "uz-manga", "manga o'zbek tilida"],
  
  // Sayt egalari
  authors: [{ name: "Uz-Manga Team" }],
  creator: "Uz-Manga",
  publisher: "Uz-Manga",

  // LOGOTIP VA IKONKALAR (Vercel belgisini almashtirish uchun)
  icons: {
    icon: "/favicon.ico", // public papkasidagi favicon.ico fayli
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png", // Apple qurilmalari uchun
  },

  // OPEN GRAPH (Facebook, Telegram, Instagram ulashilganda chiqadigan ma'lumot)
  openGraph: {
    title: "Uz-Manga | Eng sara mangalar va dunxualar",
    description: "O'zbek tilidagi eng yaxshi manga, manxva va xitoy animelari platformasi.",
    url: "https://uz-manga-pro.vercel.app",
    siteName: "Uz-Manga", // GOOGLE SHU YERDAGI YOZUVNI QIDIRUVDA KO'RSATADI
    images: [
      {
        url: "/og-image.png", // Sayt ulashilganda chiqadigan rasm (1200x630 bo'lishi tavsiya etiladi)
        width: 1200,
        height: 630,
        alt: "Uz-Manga - Eng sara mangalar olami",
      },
    ],
    locale: "uz_UZ",
    type: "website",
  },

  // TWITTER/X UCHUN
  twitter: {
    card: "summary_large_image",
    title: "Uz-Manga",
    description: "O'zbekcha manga platformasi",
    images: ["/og-image.png"],
  },

  // GOOGLE ROBOTLARI UCHUN KO'RSATMA
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // JSON-LD (Schema.org) - Google sayt nomini Vercel emas, Uz-Manga ekanini aniq bilishi uchun
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Uz-Manga",
    "alternateName": ["UzManga", "Uz-Manga Pro"],
    "url": "https://uz-manga-pro.vercel.app/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://uz-manga-pro.vercel.app/catalog?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="uz">
      <head>
        {/* Google sayt nomini tanishi uchun maxsus skript */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
