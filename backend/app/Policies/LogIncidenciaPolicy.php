<?php

namespace App\Policies;

use App\Models\Usuario;
use App\Models\LogIncidencia;
use Illuminate\Auth\Access\HandlesAuthorization;

class LogIncidenciaPolicy
{
    use HandlesAuthorization;

    public function viewAny(Usuario $user)
    {
        return true;
    }

    public function view(Usuario $user, LogIncidencia $log)
    {
        return true;
    }

    public function create(Usuario $user)
    {
        return $user->rol === 'admin' || $user->rol === 'tecnico';
    }

    public function update(Usuario $user, LogIncidencia $log)
    {
        return $user->rol === 'admin' || $user->rol === 'tecnico';
    }

    public function delete(Usuario $user, LogIncidencia $log)
    {
        return $user->rol === 'admin';
    }
} 