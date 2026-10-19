<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\ConditionCheck;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $user = auth()->user();
        $checks = ConditionCheck::with(['asset:id,asset_code,name', 'user:id,name'])
            ->when(! $user->isAdmin(), fn ($query) => $query->where('user_id', $user->id))
            ->latest()
            ->limit(6)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'total' => Asset::count(),
                'good' => Asset::where('condition', 'good')->count(),
                'attention' => Asset::whereIn('condition', ['fair', 'poor', 'damaged'])->count(),
                'pending' => ConditionCheck::where('review_status', 'pending')->count(),
            ],
            'recentChecks' => $checks,
            'conditionCounts' => [
                'good' => Asset::where('condition', 'good')->count(),
                'fair' => Asset::where('condition', 'fair')->count(),
                'poor' => Asset::where('condition', 'poor')->count(),
                'damaged' => Asset::where('condition', 'damaged')->count(),
            ],
            'isAdmin' => $user->isAdmin(),
        ]);
    }
}
