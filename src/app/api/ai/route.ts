import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import type { AIRequestBody, AIResponse } from "@/types/ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body: AIRequestBody = await req.json();
    const { gempa, profile } = body;

    if (!gempa || !profile) {
      return NextResponse.json(
        { error: "Data gempa dan profil user wajib diisi." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[AI Route] GEMINI_API_KEY is not defined");
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const elderlyNote = profile.has_elderly
      ? "Ada anggota keluarga LANSIA yang membutuhkan bantuan mobilitas."
      : "Tidak ada lansia.";
    const infantNote = profile.has_infant
      ? "Ada BAYI/BALITA yang harus dibawa serta dan dijaga keselamatannya."
      : "Tidak ada bayi/balita.";

    const prompt = `Kamu adalah sistem AI tanggap bencana gempa. Analisis data gempa dan profil pengguna berikut, lalu berikan TEPAT 3 poin instruksi.

DATA GEMPA:
- Wilayah: ${gempa.Wilayah}
- Magnitudo: ${gempa.Magnitude} SR
- Potensi: ${gempa.Potensi}

PROFIL PENGGUNA:
- Lokasi: ${profile.location}
- Jenis Rumah: ${profile.house_type}
- ${elderlyNote}
- ${infantNote}

ATURAN PENTING:
1. ANALISIS LOKASI: Jika Lokasi Pengguna jauh dan terindikasi AMAN dari Wilayah Bencana, berikan instruksi untuk tetap tenang dan waspada (tidak perlu evakuasi darurat).
2. Jika terindikasi TERDAMPAK, instruksi HARUS spesifik taktik evakuasi dari (${profile.house_type}) dan prioritaskan lansia/bayi jika ada.
3. PREPAREDNESS: Pada poin evakuasi, selalu ingatkan untuk meraih "Tas Siaga Bencana" atau dokumen penting.
4. FORMAT: Kembalikan respons HANYA dalam bentuk JSON Array murni berisi 3 string. JANGAN GUNAKAN format markdown \`\`\`json. 
Contoh yang benar: ["Instruksi satu", "Instruksi dua", "Instruksi tiga"]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    if (text.startsWith("```")) {
      text = text.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    }

    const instructionsArray = JSON.parse(text);

    return NextResponse.json({ instructions: instructionsArray });
  } catch (err: any) {
    console.error("[AI Route Error]", err);
    return NextResponse.json(
      { error: "Gagal menghasilkan instruksi evakuasi.", details: err.message },
      { status: 500 }
    );
  }
}
