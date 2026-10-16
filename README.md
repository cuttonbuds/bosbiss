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
src/hooks.js               useTheme, useActiveSection, useInView, useIdle
src/data/content.js        SEMUA teks/konten situs
src/components/Mark.jsx    logo SVG (path hasil tracing) + konstanta path
src/components/Logo3D.jsx  logo 3D: path SVG diekstrusi jadi mesh, animasi + parallax
src/components/Hero.jsx    hero; memuat Logo3D secara lazy
src/components/Sections.jsx About, What I do, Products, Projects, Articles, Contact
src/components/Nav.jsx, Stem.jsx, Footer.jsx
src/lib/config.js          URL + publishable key Supabase
src/lib/useSiteContent.js  fetch konten live (1 RPC) + cache localStorage
src/lib/supabase.js        client supabase-js (hanya dipakai dashboard)
src/admin/                 dashboard: Admin.jsx, AuthForm, ProfileEditor, CollectionEditor, schema.js
public/assets/             logo asli + turunan (favicon, apple-touch-icon, og.png)
```

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:5174
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
- Animasi reveal memakai CSS scroll-driven (`animation-timeline: view()`),
  tanpa JavaScript. Browser lama langsung menampilkan konten tanpa animasi.

## Konten dinamis (Supabase)

Project Supabase: `yzhlhuanxxcvvyjzzole` (https://yzhlhuanxxcvvyjzzole.supabase.co).

Tabel di schema `public`:

| Tabel | Isi |
|---|---|
| `profile` | satu baris: hero, foto, WhatsApp, CV, about, intro tiap section, kontak, footer |
| `services` | kartu "What I do" (key, title, description) |
| `products` | produk digital (title, description, price_label, url) |
| `projects` | proyek (title, image_url, description, details/case study, tags[], year, url) |
| `articles` | tulisan (title, description, url, published_on) |
| `testimonials` | testimoni klien (quote, author, role) |
| `social_links` | tautan sosial (label, url) |
| `admins` | daftar email yang boleh mengedit |

Section Products, Projects, Articles, dan Testimonials otomatis disembunyikan
kalau tidak ada baris yang published. Tombol WhatsApp dan Download CV muncul
hanya jika diisi di Profile.

Semua tabel koleksi punya `sort_order` dan `published`. RLS aktif:
publik hanya bisa membaca baris `published`, dan hanya email di `admins`
(dicek lewat fungsi `is_admin()`) yang bisa insert/update/delete.

Situs publik membaca semua konten lewat satu RPC `get_site_content()` dengan
`fetch` biasa (tanpa supabase-js), merender dulu dari cache/konten statis,
lalu menukar ke data live. Mapping DB → komponen ada di `src/data/content.js`.

### Dashboard admin

Buka `/admin`. Login memakai Supabase Auth (email + password).

Tidak ada pendaftaran dari UI. Akun admin dibuat oleh pemilik situs di
Supabase Dashboard → Authentication → Users → **Add user** (centang
*Auto Confirm User*), dengan email yang ada di tabel `admins`
(saat ini `bisrimustofa312@gmail.com`).

1. Sign in dengan email + password tersebut.
2. Tab: Profile, What I do, Products, Projects, Articles, Testimonials, Social.
   Foto profil, thumbnail proyek, dan CV bisa diunggah langsung dari form
   (tersimpan di Storage bucket `media`, publik baca, admin tulis).
3. Untuk menambah admin lain: buat user-nya di Supabase, lalu
   `insert into public.admins (email) values ('...')`.
4. Disarankan matikan *Allow new users to sign up* di
   Authentication → Providers → Email agar signup lewat API juga tertutup.

Catatan pengaturan Supabase (Dashboard → Authentication):
- SMTP bawaan dibatasi beberapa email per jam. Untuk produksi, pasang SMTP
  sendiri di *Settings → Auth → SMTP*.
- Tambahkan URL situs produksi ke *URL Configuration → Redirect URLs*
  (mis. `https://bosbiss.com/admin`).

Konfigurasi URL/key ada di `src/lib/config.js` (bisa di-override lewat
`VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`, lihat `.env.example`).
`vercel.json` me-rewrite semua path ke `index.html` agar `/admin` bisa dibuka langsung.

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

Konten diubah lewat dashboard `/admin` (tersimpan di Supabase). Salinan statis
sebagai fallback first-paint ada di `src/data/content.js` (`staticContent`).

Logo dipakai sebagai komponen `<Mark/>` (SVG hasil tracing dari
`public/assets/Logo B — Mark-selection.png`). Path yang sama diekstrusi
menjadi geometri 3D di `Logo3D.jsx`, jadi versi 2D dan 3D selalu identik.
