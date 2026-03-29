import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import type { AIRequestBody, AIResponse } from "@/types/ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  let userLocation = "dalam ruangan";
  try {
    const body: AIRequestBody = await req.json();
    const { gempa, profile } = body;
    userLocation = profile?.location || "dalam ruangan";

    if (!gempa || !profile) {
      return NextResponse.json(
        { error: "Data gempa dan profil user wajib diisi." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[AI Route] GEMINI_API_KEY is not defined");
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    // Use gemini-1.5-flash which is widely available and fast
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const elderlyNote = profile.has_elderly
      ? "Ada anggota keluarga LANSIA yang membutuhkan bantuan mobilitas."
      : "Tidak ada lansia.";
    const infantNote = profile.has_infant
      ? "Ada BAYI/BALITA yang harus dibawa serta dan dijaga keselamatannya."
      : "Tidak ada bayi/balita.";

    const prompt = `Anda adalah asisten AI keselamatan bencana gempa. 
Analisis data gempa dan profil pengguna berikut, lalu berikan 3 instruksi evakuasi yang singkat, jelas, dan spesifik.

DATA GEMPA:
- Wilayah: ${gempa.Wilayah}
- Magnitudo: ${gempa.Magnitude}
- Potensi: ${gempa.Potensi}

PROFIL PENGGUNA:
- Lokasi: ${profile.location}
- Jenis Rumah: ${profile.house_type}
- Anggota Keluarga: ${elderlyNote} ${infantNote}

INSTRUKSI:
1. Berikan rekomendasi spesifik (misal: "Gunakan tangga darurat, jangan lift" jika di gedung tinggi).
2. Prioritaskan keselamatan lansia/bayi jika ada di profil.
3. Selalu ingatkan tentang Tas Siaga Bencana.

Format: HANYA JSON array berisi 3 string. Contoh: ["Poin 1", "Poin 2", "Poin 3"]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const instructionsArray = JSON.parse(cleanJson);

    return NextResponse.json({ instructions: instructionsArray });
  } catch (err: any) {
    console.error("[AI Route Error]:", err);
    
    // Fallback instructions in case of any failure
    const fallbackInstructions = [
      "Tetap tenang dan jangan panik. Lindungi kepala Anda menggunakan bantal atau tangan.",
      `Berlindung di bawah meja yang kokoh atau merapat ke dinding jika Anda berada di ${userLocation}.`,
      "Segera amankan Tas Siaga Bencana dan pantau informasi resmi dari BMKG."
    ];

    // Always return instructions even on 500 for better UX
    return NextResponse.json({ 
      instructions: fallbackInstructions,
      error: err.message,
      isFallback: true
    }, { status: 200 }); // Return 200 so frontend can display them easily
  }
}
