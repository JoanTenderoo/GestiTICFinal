<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\UbicacionController;
use App\Http\Controllers\EquipamientoController;
use App\Http\Controllers\IncidenciaController;
use App\Http\Controllers\LogIncidenciaController;

// Rutas públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/change-password', [AuthController::class, 'changePassword']);

// Rutas de recuperación de contraseña
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Rutas de recursos
    Route::apiResource('usuarios', UsuarioController::class);
    Route::apiResource('ubicaciones', UbicacionController::class);
    Route::apiResource('equipamiento', EquipamientoController::class);
    Route::apiResource('incidencias', IncidenciaController::class);
    Route::apiResource('logs-incidencias', LogIncidenciaController::class);
    Route::apiResource('locations', UbicacionController::class);
}); 