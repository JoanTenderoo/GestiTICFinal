<?php

namespace App\Policies;

use App\Models\Usuario;
use App\Models\Equipamiento;
use Illuminate\Auth\Access\HandlesAuthorization;

class EquipamientoPolicy
{
    use HandlesAuthorization;

    public function viewAny(Usuario $user)
    {
        return true;
    }

    public function view(Usuario $user, Equipamiento $equipamiento)
    {
        return true;
    }

    public function create(Usuario $user)
    {
        return $user->rol === 'admin' || $user->rol === 'tecnico';
    }

    public function update(Usuario $user, Equipamiento $equipamiento)
    {
        return $user->rol === 'admin' || $user->rol === 'tecnico';
    }

    public function delete(Usuario $user, Equipamiento $equipamiento)
    {
        return $user->rol === 'admin';
    }
} 