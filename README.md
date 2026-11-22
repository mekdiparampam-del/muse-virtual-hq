# MUSE Virtual HQ — MVP 0.1

Prototype awal Telegram Mini App dengan gaya pixelated first-person.

## Yang sudah ada
- Three.js first-person scene (resolusi render rendah untuk nuansa pixel).
- Lobby kantor sederhana.
- Dua karakter dummy: Bongoy dan Konek.
- Kontrol joystick sentuh, geser layar untuk melihat, dan tombol interaksi.
- Panel dialog dan denah placeholder.
- Telegram WebApp SDK dimuat; aplikasi tetap bisa dijalankan di browser biasa.

## Menjalankan lokal
Butuh Node.js 20+.

```bash
npm install
npm run dev
```

Buka URL lokal yang ditampilkan Vite. Untuk pengujian Telegram, aplikasi harus di-host di URL HTTPS dan dipasang sebagai Mini App melalui BotFather / menu bot.

## Build produksi
```bash
npm run build
```
Hasil build berada di folder `dist/`.

## Batasan prototype
Ini belum versi kantor lengkap:
- Dialog masih teks contoh, belum memakai Groq.
- Karakter belum punya AI mandiri atau memori.
- Lobby masih berupa satu area prototipe.
- Belum ada autentikasi Telegram di backend.
- Belum ada penyimpanan progres.
- Belum ada sistem 17 pegawai.

## Langkah berikutnya
1. Uji gerak dan performa di HP.
2. Perbaiki layout dan collision.
3. Tambahkan ruangan dan karakter pixel.
4. Buat backend simulasi dan event sosial.
5. Tambahkan AI dialogue secara terkontrol.
6. Hubungkan bot Telegram setelah frontend stabil.

Jangan memasukkan bot token atau Groq API key ke file frontend.
