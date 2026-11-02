# 📸 Sahitya Satvimsati - Photobooth 3 Frames

Aplikasi Web Photobooth interaktif berbasis **Vue 3 + Vite** dengan fitur **Auto-Capture berurutan 3 Frame**, efek shutter audio realistis, filter foto live, dan ekspor strip foto beresolusi tinggi.

---

## ✨ Fitur Utama

1. **Auto-Capture 3 Frame Berurutan**:
   - Sekali klik tombol shutter (atau tekan `[Spasi]`), sistem otomatis menghitung mundur (3 detik / 5 detik).
   - Mengambil **Frame 1**, memberi jeda 1 detik untuk ganti pose, menghitung mundur untuk **Frame 2**, dan berlanjut ke **Frame 3**.
   - Dilengkapi flash kamera visual dan efek suara shutter mechanical sintetis (Web Audio API).

2. **Strip Foto Vertikal (Photobooth Style)**:
   - Menampilkan strip foto 3 frame yang terisi langsung secara real-time saat setiap frame terpotret.
   - Pilihan tema warna strip (Putih Klasik, Midnight Dark, Vintage Cream, Pastel Pink, Matcha Green, Lavender Haze).
   - Kustomisasi teks judul acara, subjudul, stiker/emoji, dan tanggal.

3. **Live Filter & Preview**:
   - Filter foto langsung: Normal, Vintage 90s, B&W Classic, Soft Warmth, Dramatic Noir, dan Cyberpunk.
   - Fitur Mirror kamera untuk sudut pandang alami layaknya cermin.
   - Mode Demo (Kamera Virtual) jika perangkat belum memiliki webcam atau izin ditolak.

4. **Ekspor & Download Beresolusi Tinggi**:
   - Download strip lengkap 3 frame dalam format PNG siap cetak / simpan.
   - Download foto per frame individual (Frame 1, 2, atau 3).
   - Tombol "Ulangi Foto" (Retake) untuk sesi foto baru.

---

## 🚀 Cara Menjalankan

### 1. Menjalankan Server Pengembangan (Dev)
```bash
npm run dev
```
Buka browser di URL yang muncul (biasanya `http://localhost:5173`).

### 2. Membangun untuk Produksi (Build)
```bash
npm run build
```
Hasil build siap di-host berada di folder `dist/`.
