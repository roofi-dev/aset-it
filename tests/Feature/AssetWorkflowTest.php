<?php

namespace Tests\Feature;

use App\Models\Asset;
use App\Models\ConditionCheck;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class AssetWorkflowTest extends TestCase
{
    use DatabaseTransactions;

    public function test_guest_is_redirected_to_login_and_login_regenerates_session(): void
    {
        $this->get('/dashboard')->assertRedirect('/login');

        $user = User::factory()->create([
            'email' => 'staff@example.test',
            'password' => 'Strong#Password2026',
            'role' => 'staff',
        ]);

        $this->post('/login', [
            'email' => 'STAFF@example.test',
            'password' => 'Strong#Password2026',
        ])->assertRedirect('/dashboard');

        $this->assertAuthenticatedAs($user);
    }

    public function test_login_rejects_invalid_password(): void
    {
        User::factory()->create(['email' => 'staff@example.test']);

        $this->from('/login')->post('/login', [
            'email' => 'staff@example.test',
            'password' => 'wrong-password',
        ])->assertRedirect('/login')
            ->assertSessionHasErrors('email');

        $this->assertGuest();
    }

    public function test_staff_can_submit_a_condition_check_and_admin_can_review_it(): void
    {
        $staff = User::factory()->create(['role' => 'staff']);
        $admin = User::factory()->create(['role' => 'admin']);
        $asset = Asset::create([
            'asset_code' => 'ATK-TEST-1',
            'name' => 'Laptop Uji',
            'category' => 'Laptop',
            'location' => 'Ruang Uji',
            'condition' => 'good',
            'status' => 'in_use',
        ]);

        $this->actingAs($staff)->post('/checks', [
            'asset_id' => $asset->id,
            'condition' => 'poor',
            'notes' => 'Baterai cepat habis dan perlu diperiksa.',
        ])->assertRedirect();

        $this->assertDatabaseHas('assets', ['id' => $asset->id, 'condition' => 'poor']);
        $this->assertDatabaseHas('condition_checks', [
            'asset_id' => $asset->id,
            'user_id' => $staff->id,
            'review_status' => 'pending',
        ]);

        $check = ConditionCheck::firstOrFail();
        $this->actingAs($admin)->post("/checks/{$check->id}/review")->assertRedirect();

        $this->assertDatabaseHas('condition_checks', [
            'id' => $check->id,
            'review_status' => 'reviewed',
            'reviewed_by' => $admin->id,
        ]);
    }

    public function test_staff_can_stock_assets_but_cannot_edit_inventory_records(): void
    {
        $staff = User::factory()->create(['role' => 'staff']);

        $this->actingAs($staff)->post('/assets', [
            'asset_code' => 'ATK-STAFF-NEW',
            'name' => 'Laptop stok petugas',
            'category' => 'Laptop',
            'location' => 'Ruang IT',
            'condition' => 'good',
            'status' => 'available',
        ])->assertRedirect();

        $this->assertDatabaseHas('assets', ['asset_code' => 'ATK-STAFF-NEW']);

        $asset = Asset::create([
            'asset_code' => 'ATK-STAFF-1',
            'name' => 'Laptop',
            'category' => 'Laptop',
            'location' => 'Ruang IT',
            'condition' => 'good',
            'status' => 'available',
        ]);

        $this->actingAs($staff)->put("/assets/{$asset->id}", [
            'asset_code' => 'ATK-STAFF-1',
            'name' => 'Diubah petugas',
            'category' => 'Laptop',
            'location' => 'Ruang IT',
            'condition' => 'good',
            'status' => 'available',
        ])->assertForbidden();
    }

    public function test_database_seeder_creates_at_least_twenty_assets(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->assertSame(24, Asset::count());
        $this->assertDatabaseHas('users', ['email' => 'admin@aset.local', 'role' => 'admin']);
        $this->assertDatabaseHas('users', ['email' => 'petugas@aset.local', 'role' => 'staff']);
    }
}
