<?php

namespace App\Http\Controllers;

use App\Models\Ubicacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UbicacionController extends Controller
{
    public function index()
    {
        $ubicaciones = Ubicacion::all();
        return response()->json($ubicaciones);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'edificio' => 'nullable|string|max:255',
            'planta' => 'nullable|string|max:255',
            'aula' => 'nullable|string|max:255',
            'observaciones' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $ubicacion = Ubicacion::create($request->all());
        return response()->json($ubicacion, 201);
    }

    public function show($id)
    {
        $ubicacion = Ubicacion::findOrFail($id);
        return response()->json($ubicacion);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'edificio' => 'nullable|string|max:255',
            'planta' => 'nullable|string|max:255',
            'aula' => 'nullable|string|max:255',
            'observaciones' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $ubicacion = Ubicacion::findOrFail($id);
        $ubicacion->update($request->all());
        return response()->json($ubicacion);
    }

    public function destroy($id)
    {
        $ubicacion = Ubicacion::findOrFail($id);
        $ubicacion->delete();
        return response()->json(null, 204);
    }
} 