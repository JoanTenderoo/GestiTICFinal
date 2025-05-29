<?php

namespace App\Http\Controllers;

use App\Models\LogIncidencia;
use Illuminate\Http\Request;

class LogIncidenciaController extends Controller
{
    public function index(Request $request)
    {
        $query = LogIncidencia::with(['usuario', 'incidencia']);

        // Filtrado por incidencia
        if ($request->has('incidencia_id')) {
            $query->where('incidencia_id', $request->incidencia_id);
        }

        // Filtrado por usuario
        if ($request->has('usuario_id')) {
            $query->where('usuario_id', $request->usuario_id);
        }

        // Filtrado por acción
        if ($request->has('accion')) {
            $query->where('accion', $request->accion);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'incidencia_id' => 'required|exists:incidencias,id',
            'usuario_id' => 'required|exists:usuarios,id',
            'accion' => 'required|string',
            'descripcion' => 'nullable|string'
        ]);

        $log = LogIncidencia::create($request->all());
        return response()->json($log, 201);
    }

    public function show(LogIncidencia $log)
    {
        return response()->json($log->load(['usuario', 'incidencia']));
    }

    public function update(Request $request, LogIncidencia $log)
    {
        $request->validate([
            'accion' => 'string',
            'descripcion' => 'nullable|string'
        ]);

        $log->update($request->all());
        return response()->json($log);
    }

    public function destroy(LogIncidencia $log)
    {
        $log->delete();
        return response()->json(null, 204);
    }

    public function getByIncidencia($incidenciaId)
    {
        $logs = LogIncidencia::where('incidencia_id', $incidenciaId)
            ->with(['usuario', 'incidencia'])
            ->get();
            
        return response()->json($logs);
    }
} 