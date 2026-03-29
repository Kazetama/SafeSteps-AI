# SafeSteps AI - Asisten Evakuasi Gempa Cerdas 🌍🌋

**SafeSteps AI** adalah solusi inovatif berbasis Kecerdasan Buatan (AI) yang dirancang untuk meningkatkan kesiapsiagaan masyarakat menghadapi bencana gempa bumi. Dengan mengintegrasikan data real-time dari BMKG dan model bahasa besar (LLM) Gemini, aplikasi ini memberikan instruksi evakuasi yang dipersonalisasi sesuai dengan profil risiko dan lokasi pengguna.

---

## 🌟 Fitur Utama

- **Integrasi Real-time BMKG**: Mengambil data gempa otomatis dari API Pusat Gempa Nasional (BMKG).
- **Personalized AI Instructions**: Menggunakan model Gemini AI untuk menghasilkan strategi evakuasi spesifik berdasarkan:
  - Lokasi geografis relatif terhadap pusat gempa.
  - Jenis tempat tinggal (misal: apartemen vs rumah tapak).
  - Keberadaan anggota keluarga rentan (Lansia, Bayi/Balita).
- **Modern UI/UX**: Antarmuka premium yang bersih, responsif, dan mendukung *dark mode* menggunakan shadcn/ui.
- **Dicoding Compliance**: Sudah menyertakan meta-tag verifikasi untuk penyerahan proyek IDCamp.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **AI Model**: [Google Gemini AI](https://aistudio.google.com/)
- **Source Data**: [BMKG DataMKG API](https://data.bmkg.go.id/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Memulai (Getting Started)

### 1. Persiapan Environment
Salin file `.env.example` menjadi `.env.local` dan masukkan API Key Gemini Anda.

```bash
cp .env.example .env.local
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan Server Development
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 📂 Struktur Proyek

- `src/app`: Logika halaman utama dan rute API.
- `src/components/ui`: Komponen antarmuka berbasis shadcn/ui.
- `src/lib`: Utilitas untuk fetch data BMKG.
- `src/types`: Definisi antarmuka TypeScript yang terpusat dan modular.
- `src/app/api/ai`: Endpoint untuk pemrosesan instruksi evakuasi oleh AI.

---

## 🏆 IDCamp Hackathon Submission
Proyek ini dikembangkan sebagai solusi AI untuk Kesiapsiagaan Bencana dalam kompetisi IDCamp.

- **Developer**: SafeSteps Team
- **Tag**: AI for Disaster Preparedness
- **Status**: MVP (Minimum Viable Product)

---

## 📄 Lisensi
Proyek ini dilisensikan di bawah MIT License.
