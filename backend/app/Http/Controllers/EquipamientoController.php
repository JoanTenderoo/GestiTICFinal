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
            'numero_serie.unique' => 'Ya existe un equipo con este número de serie.',
            'id_ubicacion.exists' => 'La ubicación seleccionada no existe.',
            'estado.in' => 'El estado debe ser: operativo, averiado, reparación o retirado.'
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
            'numero_serie.unique' => 'Ya existe un equipo con este número de serie.',
            'id_ubicacion.exists' => 'La ubicación seleccionada no existe.',
            'estado.in' => 'El estado debe ser: operativo, averiado, reparación o retirado.'
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