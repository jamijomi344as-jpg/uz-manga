import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const fileId = req.nextUrl.searchParams.get("fileId");
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!fileId || !token) return NextResponse.json({ error: "Ma'lumot yetarli emas" }, { status: 400 });

  try {
    // 1. Telegramdan fayl yo'lini so'raymiz
    const getFile = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`);
    const fileData = await getFile.json();

    if (!fileData.ok) throw new Error("Telegram faylni topa olmadi");

    const filePath = fileData.result.file_path;
    const downloadUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;

    // 2. To'g'ridan-to'g'ri download linkni qaytaramiz
    return NextResponse.json({ url: downloadUrl });
  } catch (err) {
    return NextResponse.json({ error: "Telegram API xatosi" }, { status: 500 });
  }
}