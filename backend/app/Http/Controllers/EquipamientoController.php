<?php

namespace App\Http\Controllers;

use App\Models\Equipamiento;
use Illuminate\Http\Request;

class EquipamientoController extends Controller
{
    public function index()
    {
        return response()->json(Equipamiento::with('ubicacion')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_ubicacion' => 'required|exists:ubicaciones,id_ubicacion',
            'modelo' => 'required|string|max:100',
            'numero_serie' => 'required|string|max:50|unique:equipamiento',
            'estado' => 'required|string|in:operativo,averiado,reparacion,retirado',
            'observaciones' => 'nullable|string'
        ], [
            'id_ubicacion.required' => 'La ubicación es obligatoria.',
            'id_ubicacion.exists' => 'La ubicación seleccionada no existe.',
            'modelo.required' => 'El modelo es obligatorio.',
            'modelo.string' => 'El modelo debe ser un texto válido.',
            'modelo.max' => 'El modelo no puede tener más de 100 caracteres.',
            'numero_serie.required' => 'El número de serie es obligatorio.',
            'numero_serie.string' => 'El número de serie debe ser un texto válido.',
            'numero_serie.max' => 'El número de serie no puede tener más de 50 caracteres.',
            'numero_serie.unique' => 'Ya existe un equipo con este número de serie.',
            'estado.required' => 'El estado es obligatorio.',
            'estado.string' => 'El estado debe ser un texto válido.',
            'estado.in' => 'El estado debe ser: operativo, averiado, reparación o retirado.',
            'observaciones.string' => 'Las observaciones deben ser un texto válido.'
        ]);

        $equipamiento = Equipamiento::create($request->all());
        return response()->json($equipamiento, 201);
    }

    public function show(Equipamiento $equipamiento)
    {
        return response()->json($equipamiento->load('ubicacion'));
    }

    public function update(Request $request, Equipamiento $equipamiento)
    {
        $request->validate([
            'id_ubicacion' => 'nullable|exists:ubicaciones,id_ubicacion',
            'modelo' => 'string|max:100',
            'numero_serie' => 'string|max:50|unique:equipamiento,numero_serie,' . $equipamiento->id_equipamiento . ',id_equipamiento',
            'estado' => 'string|in:operativo,averiado,reparacion,retirado',
            'observaciones' => 'nullable|string'
        ], [
            'id_ubicacion.exists' => 'La ubicación seleccionada no existe.',
            'modelo.string' => 'El modelo debe ser un texto válido.',
            'modelo.max' => 'El modelo no puede tener más de 100 caracteres.',
            'numero_serie.string' => 'El número de serie debe ser un texto válido.',
            'numero_serie.max' => 'El número de serie no puede tener más de 50 caracteres.',
            'numero_serie.unique' => 'Ya existe un equipo con este número de serie.',
            'estado.string' => 'El estado debe ser un texto válido.',
            'estado.in' => 'El estado debe ser: operativo, averiado, reparación o retirado.',
            'observaciones.string' => 'Las observaciones deben ser un texto válido.'
        ]);

        $equipamiento->update($request->all());
        return response()->json($equipamiento);
    }

    public function destroy(Equipamiento $equipamiento)
    {
        $equipamiento->delete();
        return response()->json(null, 204);
    }
} 