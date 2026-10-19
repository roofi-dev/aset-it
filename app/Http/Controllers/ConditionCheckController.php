<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\ConditionCheck;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ConditionCheckController extends Controller
{
    public function index(Request $request): Response
    {
        $checks = ConditionCheck::with([
            'asset:id,asset_code,name,location',
            'user:id,name',
            'reviewer:id,name',
        ])
            ->when(! $request->user()->isAdmin(), fn ($query) => $query->where('user_id', $request->user()->id))
            ->when($request->user()->isAdmin() && $request->string('status')->value(), fn ($query, $status) => $query->where('review_status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Checks/Index', [
            'checks' => $checks,
            'assets' => Asset::query()->orderBy('asset_code')->get(['id', 'asset_code', 'name']),
            'isAdmin' => $request->user()->isAdmin(),
            'filters' => $request->only('status'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'asset_id' => ['required', 'integer', 'exists:assets,id'],
            'condition' => ['required', Rule::in(['good', 'fair', 'poor', 'damaged'])],
            'notes' => ['required', 'string', 'min:5', 'max:2000'],
        ]);

        DB::transaction(function () use ($request, $data) {
            $asset = Asset::query()->lockForUpdate()->findOrFail($data['asset_id']);

            ConditionCheck::create([
                ...$data,
                'user_id' => $request->user()->id,
            ]);

            $asset->update(['condition' => $data['condition']]);
        });

        return back()->with('success', 'Pemeriksaan kondisi berhasil dikirim.');
    }

    public function review(Request $request, ConditionCheck $check): RedirectResponse
    {
        abort_unless($request->user()->isAdmin(), 403);
        abort_if($check->review_status === 'reviewed', 409, 'Pemeriksaan ini sudah ditinjau.');

        $check->update([
            'review_status' => 'reviewed',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        return back()->with('success', 'Pemeriksaan ditandai sudah ditinjau.');
    }
}
