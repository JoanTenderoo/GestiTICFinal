<?php

namespace App\Policies;

use App\Models\Usuario;
use App\Models\Incidencia;
use Illuminate\Auth\Access\HandlesAuthorization;

class IncidenciaPolicy
{
    use HandlesAuthorization;

    public function viewAny(Usuario $user)
    {
        return true;
    }

    public function view(Usuario $user, Incidencia $incidencia)
    {
        return true;
    }

    public function create(Usuario $user)
    {
        return $user->rol === 'admin' || $user->rol === 'tecnico' || $user->rol === 'usuario';
    }

    public function update(Usuario $user, Incidencia $incidencia)
    {
        return $user->rol === 'admin' || $user->rol === 'tecnico' || 
               ($user->rol === 'usuario' && $incidencia->usuario_id === $user->id);
    }

    public function delete(Usuario $user, Incidencia $incidencia)
    {
        return $user->rol === 'admin' || $user->rol === 'tecnico';
    }
} 