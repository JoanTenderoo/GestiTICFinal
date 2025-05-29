<?php

namespace App\Policies;

use App\Models\Usuario;
use App\Models\Ubicacion;
use Illuminate\Auth\Access\HandlesAuthorization;

class UbicacionPolicy
{
    use HandlesAuthorization;

    public function viewAny(Usuario $user)
    {
        return true;
    }

    public function view(Usuario $user, Ubicacion $ubicacion)
    {
        return true;
    }

    public function create(Usuario $user)
    {
        return $user->rol === 'admin';
    }

    public function update(Usuario $user, Ubicacion $ubicacion)
    {
        return $user->rol === 'admin';
    }

    public function delete(Usuario $user, Ubicacion $ubicacion)
    {
        return $user->rol === 'admin';
    }
} 