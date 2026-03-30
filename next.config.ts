import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Rasm yuklash uchun ruxsatlar
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Terminal so'rayotgan "allowedDevOrigins" qatori
  // Bu safar to'g'ridan-to'g'ri asosiy qismga qo'yamiz
  allowedDevOrigins: ['192.168.1.100', 'localhost:3000'],
} as any; // Next.js tipizatsiyasi bilan muammo bo'lmasligi uchun

export default nextConfig;