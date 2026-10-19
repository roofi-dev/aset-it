# Ruang Aset

Ruang Aset adalah aplikasi inventaris aset teknologi informasi untuk mencatat stok perangkat, melakukan pemeriksaan kondisi, dan membantu administrator memantau tindak lanjutnya.

Project ini menggabungkan Laravel dan React dalam satu aplikasi same-origin menggunakan Inertia. React menangani antarmuka, sedangkan Laravel tetap menangani routing, autentikasi, otorisasi, validasi, dan akses database.

> **Versi Laravel:** project menggunakan Laravel 13, bukan Laravel 11. Dukungan keamanan Laravel 11 berakhir pada 12 Maret 2026 dan Composer memblokir versi 11 yang ditandai rentan. Laravel 13 dipilih agar kebutuhan autentikasi yang aman tidak bergantung pada framework yang sudah tidak didukung.

## Fitur aplikasi

- Login untuk dua role: `admin` dan `staff` (petugas).
- Petugas dapat melihat inventaris, mencatat stok aset baru, dan mengirim pemeriksaan kondisi.
- Petugas hanya melihat riwayat pemeriksaan miliknya sendiri.
- Admin dapat melihat ringkasan seluruh aset, melihat laporan dari semua petugas, meninjau laporan, serta mengubah data aset.
- Daftar aset memiliki pencarian, filter kategori/kondisi, dan pagination.
- Data contoh berisi 24 aset TI dari beberapa kategori, termasuk laptop, desktop, monitor, printer, jaringan, server, UPS, proyektor, dan aksesori.
- UI responsif memakai komponen INA Digital Design System dan Tailwind CSS.
- Tidak ada pendaftaran publik. Admin awal di environment non-local dibuat melalui perintah Artisan.

## Tech stack

| Teknologi | Kegunaan |
| --- | --- |
| PHP 8.3 | Bahasa backend yang menjalankan aplikasi Laravel. |
| Laravel 13 | Routing, middleware, autentikasi session, validasi, ORM, migrasi database, seeder, dan proteksi CSRF. |
| MySQL 8 | Penyimpanan data pengguna, inventaris aset, dan riwayat pemeriksaan. |
| React 19 | Membangun halaman dashboard, inventaris, login, dan pemeriksaan secara interaktif. |
| Inertia.js 3 | Menghubungkan controller Laravel ke halaman React tanpa memisahkan aplikasi menjadi backend API dan frontend server terpisah. Form, navigasi, validasi, dan data halaman tetap berjalan melalui Laravel. |
| INA Digital Design System (`@idds/react`) | Komponen UI seperti tombol, text field, pencarian, badge, dropdown, textarea, dan modal/dialog. CSS komponen diimpor dari package IDDS. |
| Tailwind CSS 4 | Utility CSS dan layout responsif. Diproses langsung oleh plugin Vite Tailwind. |
| Vite 8 | Menjalankan frontend saat development dan membangun asset JavaScript/CSS untuk production. |
| Tabler Icons | Ikon navigasi, status, dan tindakan pada UI. |
| PHPUnit 12 | Pengujian fitur autentikasi dan alur inventaris/pemeriksaan. |
| Laravel Pint | Menjaga format kode PHP sesuai style Laravel. |

Font DM Sans dan Newsreader disediakan lokal melalui Fontsource agar tipografi aplikasi tidak bergantung pada request font eksternal. IDDS dapat mengimpor font Inter-nya sendiri sesuai stylesheet resminya.

## Cara kerja aplikasi

1. Browser membuka halaman Laravel.
2. Laravel mengirim data halaman sebagai props Inertia.
3. React merender halaman dan komponen IDDS di browser.
4. Saat pengguna berpindah halaman atau mengirim form, Inertia mengirim request same-origin kembali ke Laravel.
5. Laravel memvalidasi data, memeriksa hak akses, menyimpan perubahan melalui Eloquent ke MySQL, lalu mengirim hasil kembali ke React.

Dengan pola ini, aplikasi tidak memerlukan konfigurasi CORS atau token API terpisah untuk SPA.

## Role dan hak akses

| Aksi | Petugas (`staff`) | Admin (`admin`) |
| --- | :---: | :---: |
| Melihat dashboard | Ya | Ya |
| Melihat, mencari, dan memfilter daftar aset | Ya | Ya |
| Menambahkan stok aset | Ya | Ya |
| Mengubah aset yang sudah ada | Tidak | Ya |
| Mengirim pemeriksaan kondisi aset | Ya | Ya |
| Melihat seluruh laporan pemeriksaan | Tidak, hanya miliknya | Ya |
| Meninjau laporan | Tidak | Ya |

Pemeriksaan yang dikirim petugas tersimpan sebagai riwayat dan memperbarui kondisi terkini aset. Admin kemudian dapat menandai laporan sebagai sudah ditinjau.

## Struktur data utama

- `users`: akun, password hash, dan role (`admin` atau `staff`).
- `assets`: kode aset, nama, kategori, merek/model, nomor seri, lokasi, kondisi, status penggunaan, tanggal/harga perolehan, dan catatan.
- `condition_checks`: aset yang diperiksa, petugas pelapor, kondisi temuan, catatan, status tinjauan, admin peninjau, dan waktu tinjauan.

Relasi utama: satu aset memiliki banyak pemeriksaan; satu petugas dapat mengirim banyak pemeriksaan; satu admin dapat meninjau banyak pemeriksaan.

## Keamanan

- Menggunakan Laravel web/session guard dan cookie session, bukan autentikasi buatan di sisi React.
- Login membatasi percobaan hingga 5 kali per menit berdasarkan email dan alamat IP, serta memberi pesan umum saat kredensial salah.
- Session diregenerasi setelah login. Saat logout, session diinvalidasi dan token CSRF diregenerasi.
- Request perubahan data dilindungi middleware CSRF Laravel, dan data form divalidasi di backend.
- Middleware role membatasi perubahan inventaris dan proses peninjauan hanya untuk admin.
- Password disimpan melalui hash Laravel. Pendaftaran publik tidak tersedia.
- Cookie session `HttpOnly` dan `SameSite=Lax`; konfigurasi otomatis menandai cookie `Secure` ketika `APP_ENV=production`, kecuali dioverride secara eksplisit.
- `.env` berisi konfigurasi lokal dan tidak boleh masuk Git. Gunakan HTTPS, `APP_DEBUG=false`, application key yang unik, serta password database yang kuat saat deployment.

## Persyaratan lokal

- PHP 8.3+
- Composer 2
- Node.js 20.19+ dan npm
- MySQL 8 (Laragon)

Pastikan ekstensi PHP `pdo_mysql`, `openssl`, `mbstring`, `ctype`, `fileinfo`, dan `tokenizer` aktif.

## Menjalankan di Laragon (Windows)

Semua perintah berikut dijalankan dari folder project `C:\laragon\www\aset`.

1. Buat database kosong di MySQL Laragon:

   ```sql
   CREATE DATABASE aset_it CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. Buat konfigurasi lokal:

   ```powershell
   Copy-Item .env.example .env
   ```

   Sesuaikan `DB_USERNAME` dan `DB_PASSWORD` dengan akun MySQL lokal Anda. Untuk development lokal, gunakan `APP_ENV=local` dan `APP_DEBUG=true`.

3. Install dependency dan siapkan database:

   ```powershell
   composer install
   php artisan key:generate
   php artisan migrate --seed
   npm ci
   ```

   Seeder menambahkan 24 aset contoh serta dua akun demo hanya jika environment adalah `local` atau `testing`.

4. Jalankan server dari dua terminal:

   Terminal backend:

   ```powershell
   php artisan serve --port=8010
   ```

   Terminal frontend:

   ```powershell
   npm run dev
   ```

5. Buka `http://127.0.0.1:8010`.

Port `8010` dipakai karena port default `8000` dapat sedang digunakan aplikasi Laragon lain. Jika memilih port berbeda, sesuaikan URL di browser.

## Akun development

Seeder lokal membuat akun berikut:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@aset.local` | `Demo#Aset2026` |
| Petugas | `petugas@aset.local` | `Demo#Aset2026` |

Akun demo hanya untuk development/testing. Jangan gunakan password tersebut di production. Pada environment non-local, buat akun admin melalui prompt interaktif:

```powershell
php artisan aset:admin
```

Perintah tersebut meminta nama, email, dan password administrator. Password harus minimal 12 karakter dan mencakup huruf besar, angka, serta simbol.

## Build frontend

Menjalankan Vite dalam mode development:

```powershell
npm run dev
```

Membangun asset production:

```powershell
npm run build
```

Build akan menulis asset ke `public/build`. Folder hasil build tidak perlu dikomit; asset dapat dibangun kembali dari `package-lock.json`.

## Testing

Pengujian menggunakan database MySQL terpisah. Jangan gunakan database development untuk test karena hasil test menggunakan transaksi untuk membatalkan perubahan data.

Buat database test:

```sql
CREATE DATABASE aset_it_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Migrasikan database test sekali:

```powershell
$env:DB_DATABASE = "aset_it_test"
php artisan migrate
Remove-Item Env:DB_DATABASE
```

Jalankan seluruh test:

```powershell
php artisan test
```

Test mencakup redirect guest, autentikasi, penolakan password salah, kontrol akses role, pengiriman dan peninjauan pemeriksaan, jumlah data seeder, serta hasil pagination halaman kedua.

Format kode PHP:

```powershell
vendor/bin/pint --test app database tests routes bootstrap/app.php
```

## Route aplikasi

| Method | Path | Fungsi | Hak akses |
| --- | --- | --- | --- |
| `GET` | `/login` | Halaman masuk | Guest |
| `POST` | `/login` | Autentikasi, dibatasi 5 percobaan/menit | Guest |
| `POST` | `/logout` | Keluar dan menginvalidasi session | Login |
| `GET` | `/dashboard` | Ringkasan inventaris dan aktivitas | Login |
| `GET` | `/assets` | Daftar, pencarian, filter, dan pagination aset | Login |
| `POST` | `/assets` | Menambahkan stok aset | Login |
| `PUT` | `/assets/{asset}` | Mengubah data aset | Admin |
| `GET` | `/checks` | Riwayat pemeriksaan | Login |
| `POST` | `/checks` | Mengirim pemeriksaan kondisi | Login |
| `POST` | `/checks/{check}/review` | Menandai laporan sudah ditinjau | Admin |

## Repository

Project disimpan pada branch `main`:

`https://github.com/roofi-dev/aset-it`
