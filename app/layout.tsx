import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Uz-Manga | Eng sara mangalar va dunxualar",
  description: "O'zbek tilidagi eng yaxshi manga, manxva va xitoy animelari platformasi",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  verification: {
    // SIZNING MAXSUS KODINGIZ SHU YERDA:
    google: "kFx3OcC-1BhB5T0XUZ4X6JT2EU0aZXnEel6hndvVZds", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className={inter.className}>{children}</body>
    </html>
  );
}