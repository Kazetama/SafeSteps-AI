export interface GempaData {
  Tanggal: string;
  Jam: string;
  DateTime: string;
  Coordinates: string;
  Lintang: string;
  Bujur: string;
  Magnitude: string;
  Kedalaman: string;
  Wilayah: string;
  Potensi: string;
  Dirasakan: string;
  Shakemap: string;
}

interface BMKGResponse {
  Infogempa: {
    gempa: GempaData;
  };
}

export async function getLatestGempa(): Promise<GempaData> {
  const res = await fetch(
    "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json",
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch BMKG data: ${res.status} ${res.statusText}`);
  }

  const data: BMKGResponse = await res.json();
  return data.Infogempa.gempa;
}
