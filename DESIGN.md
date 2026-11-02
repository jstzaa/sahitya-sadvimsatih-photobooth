# DESIGN.md — Pixel Photobooth

Panduan desain untuk website photobooth bertema **pixel art × blueprint biru**. Dokumen ini jadi acuan untuk desainer dan developer agar tampilan konsisten.

---

## 1. Konsep & Mood

- **Tema:** Blueprint digital berwarna biru dengan jejak cahaya melengkung (light trail), dihiasi glyph/angka pixel art pastel yang melayang di tepi layar.
- **Mood:** Dreamy, nostalgia retro-tech, bersih, playful tapi tetap tenang.
- **Kata kunci:** pixel, grid, glow, pastel, floating, Y2K-soft.
- **Prinsip:**
  1. Area tengah selalu lega untuk kamera/foto, dekorasi hanya di tepi.
  2. Pixel art tajam (tanpa anti-aliasing), sedangkan background halus (gradasi + blur). Kontras tekstur ini adalah identitas visual utama.
  3. Satu aksen per layar, jangan ramai.

---

## 2. Aset yang Tersedia

| File | Ukuran | Fungsi | Posisi anchor |
|---|---|---|---|
| `bg.png` | 1080 × 1350 (4:5) | Background utama: biru + grid + light trail + glyph pixel di sudut | Full-bleed, `cover` |
| `1-1.png` | 1080 × 1080, transparan | Dekorasi pixel hijau-abu (cluster bentuk bintang/panah) | Kiri atas |
| `2-1.png` | 1080 × 1080, transparan | Dekorasi glyph pixel melengkung (mirip angka "9") | Kanan atas |
| `3-1.png` | 1080 × 1080, transparan | Dekorasi glyph pixel (mirip "a"/"2") | Kanan bawah |
| `4-1.png` | 1080 × 1080, transparan | Dekorasi pixel diagonal bertangga | Kiri bawah |

**Catatan penggunaan aset:**
- Overlay `1-1` s.d. `4-1` berukuran kanvas penuh (1080²) dengan objek menempel di tepi. Tumpuk dengan `position: absolute; inset: 0` pada container, atau potong (crop) sesuai kebutuhan.
- Semua overlay sebaiknya memakai `image-rendering: pixelated`.
- Ekspor ulang ke `.webp` untuk produksi; simpan `.png` sebagai master.

---

## 3. Palet Warna

### Background (dari `bg.png`)
| Token | Hex | Pemakaian |
|---|---|---|
| `--blue-900` | `#245A8C` | Dasar biru tua, bayangan |
| `--blue-700` | `#2F6496` | Background utama / panel gelap |
| `--blue-500` | `#4A80B3` | Gradasi tengah, hover |
| `--blue-300` | `#8FBCDD` | Garis grid, border lembut |
| `--blue-100` | `#CFEAF2` | Highlight, glow |
| `--white-glow` | `#FFFFFF` | Light trail, teks utama |

### Pixel accent (dari glyph di `bg.png` & overlay)
| Token | Hex | Pemakaian |
|---|---|---|
| `--lavender` | `#B8BDE0` | Glyph pixel, border tombol sekunder |
| `--ice` | `#BFE3EE` | Pixel highlight |
| `--mint` | `#D3E8D4` | Aksen utama (CTA, badge) |
| `--sage` | `#CFE3D6` | Aksen sekunder |
| `--ash` | `#D9D6D6` | Pixel netral, disabled |

### Semantik
| Token | Hex |
|---|---|
| `--success` | `#9BD8B0` |
| `--warning` | `#F2D98C` |
| `--danger` | `#F09A9A` |
| `--text-on-dark` | `#FFFFFF` |
| `--text-on-light` | `#1D3F63` |

```css
:root {
  --blue-900:#245A8C; --blue-700:#2F6496; --blue-500:#4A80B3;
  --blue-300:#8FBCDD; --blue-100:#CFEAF2;
  --lavender:#B8BDE0; --ice:#BFE3EE; --mint:#D3E8D4; --sage:#CFE3D6; --ash:#D9D6D6;
  --text-on-dark:#fff; --text-on-light:#1D3F63;
}
```

---

## 4. Tipografi

- **Heading / Logo:** `"Press Start 2P"` (atau `"Silkscreen"`) — pixel font, ukuran kecil agar tetap terbaca.
- **Body / UI:** `"VT323"` atau `"Pixelify Sans"` untuk nuansa retro; fallback `system-ui`.
- **Angka countdown:** `"Press Start 2P"`, ukuran besar, warna putih dengan glow.

| Level | Ukuran | Line-height | Catatan |
|---|---|---|---|
| Display (countdown) | 96–160px | 1 | Putih + text-shadow glow |
| H1 | 28–32px | 1.4 | Uppercase |
| H2 | 20px | 1.5 | |
| Body | 18–20px (VT323) | 1.4 | |
| Caption | 14–16px | 1.3 | `--blue-100` |

Aturan: tanpa `font-smoothing` halus untuk pixel font (`-webkit-font-smoothing: none`), kapitalisasi untuk label tombol.

---

## 5. Grid, Spasi & Pixel Unit

- **Unit dasar:** `1px-art = 4px`. Semua spasi kelipatan 4 (4, 8, 12, 16, 24, 32, 48).
- **Border radius:** `0` (tajam). Sudut “bertangga” dibuat dengan `clip-path` atau box-shadow pixel.
- **Grid layout:** 12 kolom desktop, 4 kolom mobile. Container maks 1080px, aspek foto utama 4:5 sesuai `bg.png`.
- **Safe zone dekorasi:** 15% dari tepi kiri/kanan dan 12% atas/bawah. Konten interaktif tidak boleh menimpa overlay pixel.

---

## 6. Komposisi Layar

```
┌─────────────────────────────┐
│ [1-1]                [2-1]  │  ← dekorasi atas
│                             │
│      ┌───────────────┐      │
│      │  Kamera /     │      │  ← area fokus, bebas dekorasi
│      │  Preview foto │      │
│      └───────────────┘      │
│           [ SNAP ]          │
│ [4-1]                [3-1]  │  ← dekorasi bawah
└─────────────────────────────┘
```

- `bg.png` sebagai layer paling bawah (`z-index: 0`), `background-size: cover`, `background-position: center`.
- Overlay pixel di `z-index: 1`, konten di `z-index: 2`.
- **Desktop (landscape):** background diperlebar dengan `cover`; overlay dipin ke empat sudut viewport, bukan ke container.
- **Mobile (portrait):** rasio mendekati 4:5, tampilan paling natural.

---

## 7. Komponen UI

### Tombol
- **Primary (SNAP / START):** isi `--mint`, teks `--text-on-light`, border 4px `--white-glow`, shadow pixel `4px 4px 0 var(--blue-900)`.
- **Secondary:** isi transparan, border 4px `--lavender`, teks putih.
- **Hover:** geser 2px ke kanan-bawah, shadow mengecil (efek ditekan).
- **Active:** shadow hilang, warna `--sage`.
- **Disabled:** `--ash`, opacity 0.6.

### Panel / Card
- Isi `rgba(47,100,150,.55)` + `backdrop-filter: blur(6px)`.
- Border 4px `--blue-300`, sudut tajam, shadow pixel `6px 6px 0 rgba(36,90,140,.6)`.
- Header panel dengan strip pixel kecil bergaya titik-titik (dari motif glyph).

### Frame Kamera
- Border ganda: 4px putih + 4px `--lavender` dengan sudut bertangga.
- Empat marker sudut kecil berbentuk “L” pixel di setiap pojok.
- Overlay grid tipis (`--blue-300` @ 30%) bisa di-toggle sebagai pemandu komposisi.

### Countdown
- Angka 3-2-1 besar di tengah, putih dengan glow `0 0 24px var(--blue-100)`.
- Animasi *step* (bukan smooth): `steps(4)`.

### Strip Foto (hasil)
- Format vertikal 3–4 frame, border putih 8px, background `--blue-700`.
- Stiker pixel (bintang, glyph) dapat ditempel dari aset overlay.
- Tombol: **Download**, **Retake**, **Share**.

### Ikon
- Pixel icon 16×16 atau 24×24, skala kelipatan integer, warna `--ice` / putih.

---

## 8. Efek Visual

- **Light trail:** sudah ada di `bg.png`; jika dibuat ulang di CSS/SVG, pakai stroke putih blur 2–6px, opacity 0.6–0.9.
- **Grid blueprint:** garis 1px `--blue-300` @ 35%, kotak ±36px, sedikit perspektif.
- **Pixel dissolve:** transisi antar halaman memakai pola blok pixel (mosaic) 8–16 blok.
- **Glow:** `drop-shadow(0 0 8px rgba(207,234,242,.7))` untuk elemen penting saja.

---

## 9. Animasi & Interaksi

| Elemen | Animasi | Durasi / Easing |
|---|---|---|
| Overlay pixel | Melayang naik-turun 4–8px | 4–6s, `steps(8)` looping, delay berbeda tiap overlay |
| Overlay pixel | Berkedip halus (opacity .7↔1) | 3s |
| Tombol | Press 2px | 80ms |
| Flash kamera | Layar putih lalu pudar | 150ms in, 300ms out |
| Transisi halaman | Pixel mosaic wipe | 400ms |

Hormati `prefers-reduced-motion`: matikan float, kedip, dan wipe.

---

## 10. Alur Pengguna

1. **Landing** — logo pixel, tombol `START`, background + 4 overlay.
2. **Izin kamera** — panel kecil menjelaskan izin, ikon pixel kamera.
3. **Pilih layout** — 1 foto / strip 3 / strip 4 / grid 2×2.
4. **Capture** — countdown 3-2-1, flash, ulangi sesuai jumlah frame.
5. **Review & edit** — pilih filter dan stiker pixel, retake per frame.
6. **Hasil** — strip final, download PNG, share, `Take Again`.

### Filter yang disarankan
- *Blueprint* (tint biru), *Mint Dream* (pastel hijau), *Lavender Glow*, *8-bit* (pikselasi + dithering), *B&W Grid*.

---

## 11. Responsif

| Breakpoint | Perilaku |
|---|---|
| ≤ 480px | Satu kolom, kamera lebar penuh, overlay diskalakan 60% |
| 481–1024px | Kamera maks 560px, overlay 80% |
| ≥ 1025px | Kamera di tengah (maks 640px), panel opsi di samping, overlay di sudut viewport |

---

## 12. Aksesibilitas

- Kontras teks minimum 4.5:1 (teks putih di atas `--blue-700` sudah lolos).
- Fokus keyboard: outline 4px `--mint`, offset 2px.
- Semua tombol punya label teks atau `aria-label`.
- Countdown diumumkan lewat `aria-live="assertive"`.
- Overlay dekoratif: `alt=""` dan `aria-hidden="true"`.
- Sediakan tombol alternatif unggah foto jika kamera ditolak.

---

## 13. Contoh Implementasi Dasar

```html
<main class="stage">
  <img class="deco tl" src="/assets/1-1.png" alt="" aria-hidden="true">
  <img class="deco tr" src="/assets/2-1.png" alt="" aria-hidden="true">
  <img class="deco br" src="/assets/3-1.png" alt="" aria-hidden="true">
  <img class="deco bl" src="/assets/4-1.png" alt="" aria-hidden="true">

  <section class="booth">
    <video id="cam" autoplay playsinline></video>
    <button class="btn-primary">SNAP</button>
  </section>
</main>
```

```css
.stage {
  position: relative; min-height: 100dvh; overflow: hidden;
  background: url("/assets/bg.png") center / cover no-repeat, var(--blue-700);
  color: var(--text-on-dark);
}
.deco {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; pointer-events: none;
  image-rendering: pixelated;
  animation: float 5s steps(8) infinite alternate;
}
.deco.tr { animation-delay: -1s } .deco.br { animation-delay: -2s } .deco.bl { animation-delay: -3s }
@keyframes float { to { transform: translateY(6px) } }

.btn-primary {
  font: 16px "Press Start 2P", monospace; text-transform: uppercase;
  background: var(--mint); color: var(--text-on-light);
  border: 4px solid #fff; padding: 16px 28px; border-radius: 0;
  box-shadow: 4px 4px 0 var(--blue-900); cursor: pointer;
}
.btn-primary:hover { transform: translate(2px,2px); box-shadow: 2px 2px 0 var(--blue-900); }
.btn-primary:active { transform: translate(4px,4px); box-shadow: none; background: var(--sage); }

@media (prefers-reduced-motion: reduce) { .deco { animation: none } }
```

---

## 14. Do & Don't

**Do**
- Pertahankan tepi tajam dan skala pixel kelipatan integer.
- Biarkan area tengah kosong dan bernapas.
- Pakai pastel mint/lavender sebagai aksen di atas biru.

**Don't**
- Jangan pakai border-radius, gradasi halus, atau bayangan blur pada elemen UI (hanya pada background).
- Jangan menumpuk overlay pixel di atas kamera atau teks.
- Jangan campur lebih dari dua font pixel.
- Jangan memperbesar aset pixel dengan interpolasi (buram).

---

## 15. Struktur Folder

```
/assets
  bg.png
  1-1.png  2-1.png  3-1.png  4-1.png
/fonts
/src
  styles/tokens.css
  components/
DESIGN.md
```
