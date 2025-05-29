<?php

namespace App\Policies;

use App\Models\Usuario;
use Illuminate\Auth\Access\HandlesAuthorization;

class UsuarioPolicy
{
    use HandlesAuthorization;

    public function viewAny(Usuario $user)
    {
        return $user->rol === 'admin';
    }

    public function view(Usuario $user, Usuario $model)
    {
        return $user->rol === 'admin' || $user->id === $model->id;
    }

    public function create(Usuario $user)
    {
        return $user->rol === 'admin';
    }

    public function update(Usuario $user, Usuario $model)
    {
        return $user->rol === 'admin' || $user->id === $model->id;
    }

    public function delete(Usuario $user, Usuario $model)
    {
        return $user->rol === 'admin' && $user->id !== $model->id;
    }
} 