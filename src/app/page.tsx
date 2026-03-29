"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, MapPin, Home, Users, Baby, Loader2, Sparkles } from "lucide-react";
import type { GempaData } from "@/types/bmkg";
import type { UserProfile, AIResponse } from "@/types/ai";

export default function HomePage() {
  const [gempa, setGempa] = useState<GempaData | null>(null);
  const [profile, setProfile] = useState({
    location: "",
    house_type: "",
    has_elderly: false,
    has_infant: false,
  });
  const [loading, setLoading] = useState(false);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [fetchingGempa, setFetchingGempa] = useState(true);

  useEffect(() => {
    const fetchGempa = async () => {
      try {
        const response = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json");
        const data = await response.json();
        setGempa(data.Infogempa.gempa);
      } catch (error) {
        console.error("Error fetching gempa data:", error);
      } finally {
        setFetchingGempa(false);
      }
    };

    fetchGempa();
  }, []);

  const handleSubmit = async () => {
    if (!gempa) return;
    
    setLoading(true);
    setInstructions([]);
    
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gempa: gempa,
          profile: profile,
        }),
      });

      const data = await response.json();
      if (data.instructions) {
        setInstructions(data.instructions);
      }
    } catch (error) {
      console.error("Error fetching AI instructions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex flex-col items-center text-center space-y-2">
          <div className="bg-red-500 p-3 rounded-2xl shadow-lg shadow-red-200 dark:shadow-red-900/20 mb-2">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">SafeSteps AI</h1>
          <p className="text-slate-500 dark:text-zinc-400 max-w-lg">
            Asisten evakuasi cerdas berbasis data BMKG terkini untuk keselamatan Anda dan keluarga.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none dark:bg-zinc-900 overflow-hidden">
            <div className="bg-red-500 h-1.5 w-full" />
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl flex items-center gap-2">
                  Gempa Terkini
                  <Badge variant="outline" className="text-[10px] animate-pulse">LIVE</Badge>
                </CardTitle>
                {gempa && (
                  <Badge className="bg-red-600 hover:bg-red-700">{gempa.Magnitude} SR</Badge>
                )}
              </div>
              <CardDescription>Sumber: BMKG (Pusat Gempa Nasional)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {fetchingGempa ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                  <p className="text-sm text-slate-400">Mengambil data...</p>
                </div>
              ) : gempa ? (
                <>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="p-2 bg-slate-100 dark:bg-zinc-800 rounded-lg shrink-0">
                        <MapPin className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-tighter">Wilayah</p>
                        <p className="text-sm font-semibold">{gempa.Wilayah}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="p-2 bg-slate-100 dark:bg-zinc-800 rounded-lg shrink-0">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-tighter">Potensi</p>
                        <p className="text-sm font-semibold text-red-600 dark:text-red-400">{gempa.Potensi}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900/30">
                    <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">
                      ⚠️ {gempa.DateTime} | Kedalaman: {gempa.Kedalaman}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-500">Gagal memuat data gempa.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none dark:bg-zinc-900 overflow-hidden">
            <div className="bg-zinc-950 h-1.5 w-full" />
            <CardHeader>
              <CardTitle className="text-xl">Profil Keselamatan</CardTitle>
              <CardDescription>Lengkapi data untuk instruksi yang lebih akurat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-xs font-semibold uppercase tracking-tight text-slate-500">
                    Lokasi Anda Saat Ini
                  </Label>
                  <div className="relative group">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-zinc-950 transition-colors" />
                    <Input 
                      id="location" 
                      placeholder="Contoh: Bandung, Jawa Barat" 
                      className="pl-10 h-10 border-slate-200 focus:ring-zinc-950" 
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="house_type" className="text-xs font-semibold uppercase tracking-tight text-slate-500">
                    Jenis Tempat Tinggal
                  </Label>
                  <div className="relative group">
                    <Home className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-zinc-950 transition-colors" />
                    <Input 
                      id="house_type" 
                      placeholder="Contoh: Rumah 2 lantai / Apartemen" 
                      className="pl-10 h-10 border-slate-200 focus:ring-zinc-950" 
                      value={profile.house_type}
                      onChange={(e) => setProfile({ ...profile, house_type: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center space-x-3 p-3 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/50">
                    <Checkbox 
                      id="elderly" 
                      checked={profile.has_elderly}
                      onCheckedChange={(checked) => setProfile({ ...profile, has_elderly: !!checked })}
                    />
                    <Label htmlFor="elderly" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      Ada Lansia
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/50">
                    <Checkbox 
                      id="infant" 
                      checked={profile.has_infant}
                      onCheckedChange={(checked) => setProfile({ ...profile, has_infant: !!checked })}
                    />
                    <Label htmlFor="infant" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                      <Baby className="w-4 h-4 text-slate-400" />
                      Ada Bayi/Balita
                    </Label>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full h-12 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold rounded-xl transition-all active:scale-[0.98]"
                onClick={handleSubmit}
                disabled={loading || !gempa || !profile.location}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menganalisis...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Dapatkan Instruksi Evakuasi
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {(instructions.length > 0 || loading) && (
          <Card className="border-none shadow-2xl shadow-blue-200/50 dark:shadow-none bg-white dark:bg-zinc-900 overflow-hidden ring-1 ring-blue-100 dark:ring-blue-900/30">
            <div className="bg-blue-500 h-1.5 w-full" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-blue-500" />
                  Rencana Evakuasi Anda
                </CardTitle>
                <CardDescription>Strategi keselamatan yang diformulasikan khusus oleh AI</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <div className="space-y-4 py-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 animate-pulse">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-zinc-800 rounded-full shrink-0" />
                      <div className="space-y-2 flex-1 pt-1">
                        <div className="h-4 bg-slate-100 dark:bg-zinc-800 rounded w-full" />
                        <div className="h-4 bg-slate-100 dark:bg-zinc-800 rounded w-5/6" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6 py-2">
                  {instructions.map((step, index) => (
                    <div key={index} className="flex gap-4 group">
                      <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 shrink-0 border border-blue-100 dark:border-blue-900/50 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                        {index + 1}
                      </div>
                      <p className="text-slate-700 dark:text-zinc-300 font-medium leading-relaxed pt-1.5">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-slate-50 dark:bg-zinc-800/50 px-6 py-4 border-t border-slate-100 dark:border-zinc-800">
              <p className="text-[11px] text-slate-400 text-center w-full">
                Disclaimer: Instruksi AI ini bersifat rekomendasi. Utamakan keselamatan diri dan ikuti arahan petugas di lokasi bila ada.
              </p>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
