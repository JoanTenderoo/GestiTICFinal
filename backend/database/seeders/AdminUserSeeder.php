<?php

namespace Database\Seeders;

use App\Models\Usuario;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        Usuario::create([
            'nombre' => 'Joan',
            'apellidos' => 'Tendero',
            'email' => 'joantendero34@gmail.com',
            'password' => Hash::make('12345678'),
            'rol' => 'administrador',
            'departamento' => 'TIC',
            'activo' => true
        ]);
    }
} 