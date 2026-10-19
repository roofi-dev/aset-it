<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class CreateAdminUser extends Command
{
    protected $signature = 'aset:admin';

    protected $description = 'Buat akun administrator sistem inventaris';

    public function handle(): int
    {
        $name = trim((string) $this->ask('Nama administrator'));
        $email = strtolower(trim((string) $this->ask('Alamat email')));

        if ($name === '' || mb_strlen($name) > 255 || ! filter_var($email, FILTER_VALIDATE_EMAIL) || User::where('email', $email)->exists()) {
            $this->error('Email tidak valid atau sudah terdaftar.');

            return self::FAILURE;
        }

        $password = $this->secret('Kata sandi (minimal 12 karakter)');
        $confirmed = $this->secret('Ulangi kata sandi');

        if ($password !== $confirmed || ! Password::min(12)->mixedCase()->numbers()->symbols()->passes('password', $password)) {
            $this->error('Kata sandi harus sama, minimal 12 karakter, dan memuat huruf besar, angka, serta simbol.');

            return self::FAILURE;
        }

        User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'admin',
        ]);

        $this->info("Administrator {$email} berhasil dibuat.");

        return self::SUCCESS;
    }
}
