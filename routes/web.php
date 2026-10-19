<?php

use App\Http\Controllers\AssetController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ConditionCheckController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/dashboard');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->middleware('throttle:login');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    Route::get('/dashboard', DashboardController::class)->name('dashboard');
    Route::get('/assets', [AssetController::class, 'index'])->name('assets.index');
    Route::post('/assets', [AssetController::class, 'store'])->name('assets.store');
    Route::get('/checks', [ConditionCheckController::class, 'index'])->name('checks.index');
    Route::post('/checks', [ConditionCheckController::class, 'store'])->name('checks.store');
    Route::post('/checks/{check}/review', [ConditionCheckController::class, 'review'])->name('checks.review')->middleware('admin');

    Route::middleware('admin')->group(function () {
        Route::put('/assets/{asset}', [AssetController::class, 'update'])->name('assets.update');
    });
});
