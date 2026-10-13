# Bosbiss.com — Personal Site (Bisri Mustofa)

Situs personal satu halaman dibangun dengan React + Vite, dengan logo B versi 3D
animasi (three.js) yang dimuat lazy agar first paint tetap ringan.
Konten diambil dari https://bosbiss.my.id/ (Home, Product, Articles, Projects).

## Struktur

```
index.html                 shell HTML (meta, font, script tema anti-flash)
src/main.jsx               entry React
src/App.jsx                susunan halaman
src/styles.css             styling + token warna brand
src/hooks.js               useTheme, useReveal, useActiveSection, useInView, useIdle
src/data/content.js        SEMUA teks/konten situs
src/components/Mark.jsx    logo SVG (path hasil tracing) + konstanta path
src/components/Logo3D.jsx  logo 3D: path SVG diekstrusi jadi mesh, animasi + parallax
src/components/Hero.jsx    hero; memuat Logo3D secara lazy
src/components/Sections.jsx About, What I do, Products, Projects, Articles, Contact
src/components/Nav.jsx, Stem.jsx, Footer.jsx
public/assets/             logo asli + turunan (favicon, apple-touch-icon, og.png)
```

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # output ke dist/
npm run preview    # cek hasil build
```

Deploy folder `dist/` ke Vercel, Netlify, atau hosting statis lain.

## Performa

- Chunk `three` (three.js + react-three-fiber, ~240 KB gzip) dipisah dan hanya
  diimpor dinamis setelah browser idle dan hero terlihat. First paint hanya
  memuat React + CSS + ~5 KB kode aplikasi.
- Fallback: tanpa WebGL, `prefers-reduced-motion`, atau Data Saver aktif,
  hero memakai logo SVG statis.
- Render loop 3D berhenti saat hero keluar dari viewport; pixel ratio
  dibatasi 1.5 untuk layar HiDPI.
- Font via Google Fonts dengan `preconnect` + `display=swap`.

## Konsep desain

- **Stem + titik.** Logo B punya stem terpisah dengan titik lime. Motif ini jadi
  garis vertikal tetap di sisi kiri (desktop) dengan titik yang bergerak mengikuti
  progres scroll. Titik yang sama dipakai untuk indikator nav aktif, status, dan hover.
- **Papan aset.** Label mono huruf kapital (`01 / TENTANG`, `PRODUK · 2026`) dan grid
  tipis di latar meniru lembar spesifikasi logo.
- **Warna dari aset:** ink `#0B0D10`, paper `#F2F4F5`, lime `#B8F23C`,
  olive `#4F7A00` (aksen di mode terang), line `#191B1E`.
- **Tipografi:** Geist + Geist Mono (Google Fonts), fallback system-ui.
- Mode gelap default, mengikuti `prefers-color-scheme`, bisa dipaksa lewat tombol
  di nav (tersimpan di `localStorage`).

## Mengubah konten

Semua teks ada di `src/data/content.js`: hero, about (+ tabel spec), services,
products (+ callout), projects (+ tags), articles, dan contact/socials.

Logo dipakai sebagai komponen `<Mark/>` (SVG hasil tracing dari
`public/assets/Logo B — Mark-selection.png`). Path yang sama diekstrusi
menjadi geometri 3D di `Logo3D.jsx`, jadi versi 2D dan 3D selalu identik.
