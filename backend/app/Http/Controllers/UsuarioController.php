<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    public function index()
    {
        return response()->json(Usuario::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'email' => 'required|email|unique:usuarios',
            'password' => 'required|string|min:6',
            'rol' => 'required|string|in:admin,tecnico,usuario'
        ], [
            'nombre.required' => 'El nombre es obligatorio.',
            'nombre.string' => 'El nombre debe ser un texto válido.',
            'nombre.max' => 'El nombre no puede tener más de 100 caracteres.',
            'email.required' => 'El email es obligatorio.',
            'email.email' => 'El email debe tener un formato válido.',
            'email.unique' => 'Este email ya está registrado en el sistema.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.string' => 'La contraseña debe ser un texto válido.',
            'password.min' => 'La contraseña debe tener al menos 6 caracteres.',
            'rol.required' => 'El rol es obligatorio.',
            'rol.string' => 'El rol debe ser un texto válido.',
            'rol.in' => 'El rol seleccionado no es válido.'
        ]);

        $usuario = Usuario::create([
            'nombre' => $request->nombre,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'rol' => $request->rol
        ]);

        return response()->json($usuario, 201);
    }

    public function show(Usuario $usuario)
    {
        return response()->json($usuario);
    }

    public function update(Request $request, Usuario $usuario)
    {
        $request->validate([
            'nombre' => 'string|max:100',
            'email' => 'email|unique:usuarios,email,' . $usuario->id,
            'password' => 'nullable|string|min:6',
            'rol' => 'string|in:admin,tecnico,usuario'
        ], [
            'nombre.string' => 'El nombre debe ser un texto válido.',
            'nombre.max' => 'El nombre no puede tener más de 100 caracteres.',
            'email.email' => 'El email debe tener un formato válido.',
            'email.unique' => 'Este email ya está registrado en el sistema.',
            'password.string' => 'La contraseña debe ser un texto válido.',
            'password.min' => 'La contraseña debe tener al menos 6 caracteres.',
            'rol.string' => 'El rol debe ser un texto válido.',
            'rol.in' => 'El rol seleccionado no es válido.'
        ]);

        $data = $request->all();
        if ($request->has('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $usuario->update($data);
        return response()->json($usuario);
    }

    public function destroy(Usuario $usuario)
    {
        $usuario->delete();
        return response()->json(null, 204);
    }
} 