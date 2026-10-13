# Bosbiss.com — Personal Site (Bisri Mustofa)

Situs personal statis: satu halaman, tanpa build step, tanpa dependency.
Konten diambil dari https://bosbiss.my.id/ (Home, Product, Articles, Projects).

## Struktur

```
index.html        halaman utama (semua teks/konten ada di sini)
css/style.css     styling + token warna brand
js/main.js        toggle tema, titik scroll di "stem", reveal, active nav
assets/           logo asli + turunan (favicon, apple-touch-icon, og.png)
```

## Menjalankan lokal

```bash
python -m http.server 8765
```

Lalu buka http://localhost:8765. Bisa juga langsung deploy folder ini ke Netlify, Vercel, GitHub Pages, atau hosting statis lain.

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

Semua teks ada di `index.html`:

- Hero: `<h1>` dan `.lede`
- About: `.prose` dan daftar `.spec`
- What I do: tiga `.card`
- Digital products: daftar `.work` di `#product` (link lynk.id) + `.callout`
- Projects: daftar `.work` di `#projects` (tag stack di `.tags`)
- Articles: daftar `.posts`
- Contact: email `bisrimustofa312@gmail.com`, GitHub, LinkedIn

Logo dipakai sebagai `<symbol id="mark">` (SVG hasil tracing dari
`assets/Logo B — Mark-selection.png`), sehingga tajam di semua ukuran dan
otomatis mengikuti warna tema.
