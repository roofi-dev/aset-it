# Ruang Aset

Sistem inventaris aset TI untuk petugas dan administrator. Backend Laravel menyajikan halaman React melalui Inertia sehingga navigasi, validasi formulir, autentikasi, dan data tetap terhubung dalam satu aplikasi same-origin.

> Catatan versi: project memakai Laravel 13, bukan Laravel 11. Laravel 11 telah melewati masa security support pada 12 Maret 2026 dan lini paket 11 sudah ditandai rentan oleh Composer. Laravel 13 dipilih agar kebutuhan keamanan tidak dikorbankan.

## Fitur

- Autentikasi session Laravel, CSRF protection, regenerasi session setelah login, logout yang menginvalidasi session, dan pembatasan percobaan login.
- Role admin dan petugas; tidak ada pendaftaran publik. Petugas dapat mencatat stok dan mengirim pemeriksaan kondisi, administrator meninjau laporan serta mengubah data inventaris.
- Monitoring kondisi, antrean laporan, riwayat tinjauan, pencarian, filter, dan pagination.
- Komponen tombol, input, badge, pilihan, dan dialog dari INA Digital Design System; Tailwind CSS v4 untuk layout responsif.
- 24 data aset contoh. Akun contoh hanya dibuat di environment `local` dan `testing`.

## Persyaratan

- PHP 8.3+, Composer 2
- Node.js 20.19+ dan npm
- MySQL 8 (Laragon)

## Menjalankan di Laragon

1. Buat database kosong di MySQL:

   ```sql
   CREATE DATABASE aset_it CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. Dari direktori project, siapkan konfigurasi lokal:

   ```powershell
   Copy-Item .env.example .env
   ```

   Isi `DB_USERNAME` dan `DB_PASSWORD` sesuai konfigurasi MySQL Laragon. Pastikan `APP_ENV=local` dan `APP_DEBUG=true` hanya untuk development.

3. Install dependensi, buat application key, migrasikan, dan isi data contoh:

   ```powershell
   composer install
   php artisan key:generate
   php artisan migrate --seed
   npm ci
   ```

4. Jalankan aplikasi dari dua terminal di direktori project:

   ```powershell
   php artisan serve --port=8010
   ```

   ```powershell
   npm run dev
   ```

   Buka `http://127.0.0.1:8010`.

## Akun development

- Admin: `admin@aset.local` / `Demo#Aset2026`
- Petugas: `petugas@aset.local` / `Demo#Aset2026`

Kredensial tersebut hanya tersedia saat seeding dalam environment `local` atau `testing`. Jangan gunakan akun demo untuk deployment.

Untuk membuat administrator pada environment non-local, jalankan `php artisan aset:admin` dan ikuti prompt kata sandi kuat. Gunakan HTTPS di production; cookie session otomatis ditandai `Secure` ketika `APP_ENV=production` kecuali ada override eksplisit.

## Build dan pengujian

```powershell
npm run build
```

Siapkan database test terpisah; jangan arahkan pengujian ke database development:

```sql
CREATE DATABASE aset_it_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

```powershell
$env:DB_DATABASE = "aset_it_test"
php artisan migrate
Remove-Item Env:DB_DATABASE
php artisan test
```

Test suite memakai transaksi agar data uji dibatalkan tanpa menghapus skema atau data database test.
