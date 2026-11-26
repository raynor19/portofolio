# Portfolio Gojo

Template portfolio satu halaman: React 19 + Vite + Tailwind CSS 3, dengan animasi intro, kursor glow, carousel WebGL (OGL), dan toggle bahasa EN/ID.

## Menjalankan

```bash
npm install
npm run dev      # development
npm run build    # hasil build ada di folder dist/
npm run preview  # cek hasil build
```

Butuh Node.js 18 atau lebih baru.

## Struktur

```
src/
  App.jsx              halaman utama (skill, proyek, kontak)
  translations.js      semua teks EN & ID
  components/          komponen UI & animasi
public/                gambar hero (gojo-cut-1.webp, gojo-cut-2.webp)
```

## Cara mengganti konten

- Nama, teks, dan email: `src/translations.js` dan `src/App.jsx` (cari "ANGGA" dan "hello@angga.dev").
- Skill dan persentase: konstanta `SKILLS` di `src/App.jsx`.
- Link sosial (GitHub, LinkedIn, Instagram): bagian kontak di `src/App.jsx`.
- Gambar hero: ganti file di `public/` dengan nama yang sama.
- Warna: `tailwind.config.js` dan `src/index.css`.
