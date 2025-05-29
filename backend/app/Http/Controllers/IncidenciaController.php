<?php

namespace App\Http\Controllers;

use App\Models\Incidencia;
use App\Models\LogIncidencia;
use Illuminate\Http\Request;

class IncidenciaController extends Controller
{
    public function index(Request $request)
    {
        $query = Incidencia::with(['usuario', 'equipamiento', 'ubicacion']);

        // Filtrado por estado
        if ($request->has('estado')) {
            $query->where('estado', $request->estado);
        }

        // Filtrado por prioridad
        if ($request->has('prioridad')) {
            $query->where('prioridad', $request->prioridad);
        }

        // Filtrado por equipo
        if ($request->has('equipamiento_id')) {
            $query->where('id_equipamiento', $request->equipamiento_id);
        }

        // Filtrado por ubicación
        if ($request->has('ubicacion_id')) {
            $query->where('id_ubicacion', $request->ubicacion_id);
        }

        // Filtrado por usuario
        if ($request->has('usuario_id')) {
            $query->where('id_usuario', $request->usuario_id);
        }

        // Filtrado por privacidad
        if ($request->has('es_privada')) {
            $query->where('es_privada', $request->es_privada);
        }

        // Búsqueda por título o descripción
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('titulo', 'like', "%{$search}%")
                  ->orWhere('descripcion', 'like', "%{$search}%");
            });
        }

        $incidencias = $query->get();
        
        return response()->json($incidencias);
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_equipamiento' => 'required|exists:equipamiento,id_equipamiento',
            'id_usuario' => 'required|exists:usuarios,id_usuario',
            'titulo' => 'required|string|max:200',
            'descripcion' => 'required|string',
            'estado' => 'required|string|in:pendiente,en_proceso,resuelta,cancelada',
            'prioridad' => 'required|string|in:baja,media,alta,urgente',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'nullable|date',
            'solucion' => 'nullable|string',
            'activo' => 'boolean'
        ]);

        $incidencia = Incidencia::create($request->all());
        return response()->json($incidencia->load(['usuario', 'equipamiento', 'ubicacion']), 201);
    }

    public function show(Incidencia $incidencia)
    {
        return response()->json($incidencia->load(['usuario', 'equipamiento', 'ubicacion', 'logs']));
    }

    public function update(Request $request, Incidencia $incidencia)
    {
        $request->validate([
            'id_equipamiento' => 'sometimes|exists:equipamiento,id_equipamiento',
            'id_usuario' => 'sometimes|exists:usuarios,id_usuario',
            'titulo' => 'string|max:200',
            'descripcion' => 'string',
            'estado' => 'string|in:pendiente,en_proceso,resuelta,cancelada',
            'prioridad' => 'string|in:baja,media,alta,urgente',
            'fecha_inicio' => 'date',
            'fecha_fin' => 'nullable|date',
            'solucion' => 'nullable|string',
            'activo' => 'boolean'
        ]);

        $incidencia->update($request->all());
        return response()->json($incidencia->load(['usuario', 'equipamiento', 'ubicacion']));
    }

    public function destroy(Incidencia $incidencia)
    {
        $incidencia->delete();
        return response()->json(null, 204);
    }

    // Nuevos endpoints
    public function getByEquipamiento($equipamientoId)
    {
        $incidencias = Incidencia::where('id_equipamiento', $equipamientoId)
            ->with(['usuario', 'equipamiento', 'ubicacion'])
            ->get();
            
        return response()->json($incidencias);
    }

    public function getByUbicacion($ubicacionId)
    {
        $incidencias = Incidencia::where('id_ubicacion', $ubicacionId)
            ->with(['usuario', 'equipamiento', 'ubicacion'])
            ->get();
            
        return response()->json($incidencias);
    }

    public function getByUsuario($usuarioId)
    {
        $incidencias = Incidencia::where('id_usuario', $usuarioId)
            ->with(['usuario', 'equipamiento', 'ubicacion'])
            ->get();
            
        return response()->json($incidencias);
    }

    public function getLogs(Incidencia $incidencia)
    {
        return response()->json($incidencia->logs()->with('usuario')->get());
    }

    public function updateEstado(Request $request, Incidencia $incidencia)
    {
        $request->validate([
            'estado' => 'required|string|in:pendiente,en_proceso,resuelta,cerrada',
            'usuario_id' => 'required|exists:usuarios,id_usuario'
        ]);

        $incidencia->update(['estado' => $request->estado]);

        LogIncidencia::create([
            'incidencia_id' => $incidencia->id_incidencia,
            'usuario_id' => $request->usuario_id,
            'accion' => 'cambio_estado'
        ]);

        return response()->json($incidencia->load(['usuario', 'equipamiento', 'ubicacion']));
    }
} 