<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AssetController extends Controller
{
    public function index(Request $request): Response
    {
        $assets = Asset::query()
            ->when($request->string('search')->trim()->value(), function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('asset_code', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%");
                });
            })
            ->when($request->string('condition')->value(), fn ($query, $condition) => $query->where('condition', $condition))
            ->when($request->string('category')->value(), fn ($query, $category) => $query->where('category', $category))
            ->orderBy('asset_code')
            ->paginate(8)
            ->withQueryString();

        return Inertia::render('Assets/Index', [
            'assets' => $assets,
            'filters' => $request->only('search', 'condition', 'category'),
            'categories' => Asset::query()->select('category')->distinct()->orderBy('category')->pluck('category'),
            'canManage' => $request->user()->isAdmin(),
            'canCreate' => true,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Asset::create($this->validatedData($request));

        return back()->with('success', 'Aset berhasil ditambahkan.');
    }

    public function update(Request $request, Asset $asset): RedirectResponse
    {
        $asset->update($this->validatedData($request, $asset));

        return back()->with('success', 'Perubahan aset berhasil disimpan.');
    }

    private function validatedData(Request $request, ?Asset $asset = null): array
    {
        return $request->validate([
            'asset_code' => ['required', 'string', 'max:40', Rule::unique('assets', 'asset_code')->ignore($asset)],
            'name' => ['required', 'string', 'max:160'],
            'category' => ['required', 'string', 'max:80'],
            'brand' => ['nullable', 'string', 'max:100'],
            'model' => ['nullable', 'string', 'max:100'],
            'serial_number' => ['nullable', 'string', 'max:120', Rule::unique('assets', 'serial_number')->ignore($asset)],
            'location' => ['required', 'string', 'max:120'],
            'condition' => ['required', Rule::in(['good', 'fair', 'poor', 'damaged'])],
            'status' => ['required', Rule::in(['available', 'in_use', 'maintenance', 'retired'])],
            'purchase_date' => ['nullable', 'date'],
            'purchase_price' => ['nullable', 'integer', 'min:0', 'max:999999999999'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);
    }
}
