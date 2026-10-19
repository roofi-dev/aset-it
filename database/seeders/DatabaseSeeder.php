<?php

namespace Database\Seeders;

use App\Models\Asset;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedAssets();

        if (app()->environment(['local', 'testing'])) {
            User::firstOrCreate(
                ['email' => 'admin@aset.local'],
                ['name' => 'Admin Aset', 'password' => 'Demo#Aset2026', 'role' => 'admin'],
            );
            User::firstOrCreate(
                ['email' => 'petugas@aset.local'],
                ['name' => 'Petugas Inventaris', 'password' => 'Demo#Aset2026', 'role' => 'staff'],
            );
        }
    }

    private function seedAssets(): void
    {
        $assets = [
            ['ATK-001', 'Laptop ThinkPad T14', 'Laptop', 'Lenovo', 'ThinkPad T14 Gen 3', 'SN-LNV-001', 'Ruang IT', 'good', 'in_use', 2024, 18500000],
            ['ATK-002', 'Laptop Latitude 5440', 'Laptop', 'Dell', 'Latitude 5440', 'SN-DLL-002', 'Ruang Keuangan', 'good', 'in_use', 2024, 17200000],
            ['ATK-003', 'MacBook Air M2', 'Laptop', 'Apple', 'MacBook Air M2', 'SN-APL-003', 'Ruang Pimpinan', 'good', 'in_use', 2023, 19900000],
            ['ATK-004', 'Desktop OptiPlex 7010', 'Desktop', 'Dell', 'OptiPlex 7010', 'SN-DLL-004', 'Ruang Rapat', 'fair', 'available', 2022, 12400000],
            ['ATK-005', 'Desktop ProDesk 400', 'Desktop', 'HP', 'ProDesk 400 G9', 'SN-HP-005', 'Ruang Administrasi', 'good', 'in_use', 2023, 10800000],
            ['ATK-006', 'Monitor UltraSharp 27', 'Monitor', 'Dell', 'U2723QE', 'SN-DLL-006', 'Ruang IT', 'good', 'in_use', 2024, 7900000],
            ['ATK-007', 'Monitor ProDisplay 24', 'Monitor', 'HP', 'P24 G5', 'SN-HP-007', 'Ruang Keuangan', 'fair', 'in_use', 2022, 3100000],
            ['ATK-008', 'Printer LaserJet Pro', 'Printer', 'HP', 'M404dn', 'SN-HP-008', 'Ruang Administrasi', 'good', 'in_use', 2023, 5600000],
            ['ATK-009', 'Printer EcoTank L5290', 'Printer', 'Epson', 'L5290', 'SN-EPS-009', 'Ruang Keuangan', 'poor', 'maintenance', 2021, 4800000],
            ['ATK-010', 'Scanner WorkForce ES-500W', 'Scanner', 'Epson', 'ES-500W', 'SN-EPS-010', 'Ruang Arsip', 'good', 'available', 2023, 6900000],
            ['ATK-011', 'Switch Managed 24 Port', 'Jaringan', 'TP-Link', 'JetStream TL-SG3428', 'SN-TPL-011', 'Ruang Server', 'good', 'in_use', 2024, 5200000],
            ['ATK-012', 'Access Point WiFi 6', 'Jaringan', 'Ubiquiti', 'UniFi U6 Pro', 'SN-UBQ-012', 'Lantai 1', 'good', 'in_use', 2024, 3500000],
            ['ATK-013', 'Router MikroTik RB4011', 'Jaringan', 'MikroTik', 'RB4011iGS+', 'SN-MKT-013', 'Ruang Server', 'good', 'in_use', 2023, 3400000],
            ['ATK-014', 'Server PowerEdge R450', 'Server', 'Dell', 'PowerEdge R450', 'SN-DLL-014', 'Ruang Server', 'good', 'in_use', 2022, 68500000],
            ['ATK-015', 'NAS Synology 8 Bay', 'Server', 'Synology', 'RS1221+', 'SN-SYN-015', 'Ruang Server', 'fair', 'in_use', 2022, 24900000],
            ['ATK-016', 'UPS Smart 1500VA', 'UPS', 'APC', 'Smart-UPS SMT1500IC', 'SN-APC-016', 'Ruang Server', 'poor', 'maintenance', 2021, 12300000],
            ['ATK-017', 'Proyektor EB-FH52', 'Proyektor', 'Epson', 'EB-FH52', 'SN-EPS-017', 'Ruang Rapat', 'good', 'available', 2023, 11900000],
            ['ATK-018', 'Tablet Galaxy Tab S9', 'Tablet', 'Samsung', 'Galaxy Tab S9', 'SN-SAM-018', 'Ruang Pimpinan', 'good', 'in_use', 2024, 11900000],
            ['ATK-019', 'Webcam Conference 4K', 'Aksesori', 'Logitech', 'Brio 4K', 'SN-LOG-019', 'Ruang Rapat', 'fair', 'available', 2022, 3100000],
            ['ATK-020', 'Headset Zone Wireless', 'Aksesori', 'Logitech', 'Zone Wireless', 'SN-LOG-020', 'Ruang IT', 'good', 'available', 2023, 2450000],
            ['ATK-021', 'Laptop Aspire 5', 'Laptop', 'Acer', 'Aspire 5 A515', 'SN-ACE-021', 'Ruang Pelatihan', 'damaged', 'maintenance', 2021, 9800000],
            ['ATK-022', 'Monitor LED 22 inch', 'Monitor', 'AOC', '22B2HN', 'SN-AOC-022', 'Ruang Pelatihan', 'good', 'available', 2022, 1850000],
            ['ATK-023', 'Printer Label Brother', 'Printer', 'Brother', 'QL-800', 'SN-BRO-023', 'Ruang Arsip', 'good', 'in_use', 2023, 2700000],
            ['ATK-024', 'UPS Back-UPS 900VA', 'UPS', 'APC', 'BX900MI', 'SN-APC-024', 'Ruang Administrasi', 'fair', 'available', 2022, 2100000],
        ];

        foreach ($assets as [$code, $name, $category, $brand, $model, $serial, $location, $condition, $status, $year, $price]) {
            Asset::firstOrCreate(
                ['asset_code' => $code],
                [
                    'name' => $name,
                    'category' => $category,
                    'brand' => $brand,
                    'model' => $model,
                    'serial_number' => $serial,
                    'location' => $location,
                    'condition' => $condition,
                    'status' => $status,
                    'purchase_date' => "{$year}-03-15",
                    'purchase_price' => $price,
                ],
            );
        }
    }
}
