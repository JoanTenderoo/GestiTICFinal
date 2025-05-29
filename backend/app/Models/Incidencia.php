<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Incidencia extends Model
{
    use HasFactory;

    protected $table = 'incidencias';
    protected $primaryKey = 'id_incidencia';
    public $timestamps = false;

    protected $fillable = [
        'id_equipamiento',
        'id_usuario',
        'titulo',
        'descripcion',
        'estado',
        'prioridad',
        'fecha_inicio',
        'fecha_fin',
        'solucion',
        'activo',
        'es_privada'
    ];

    protected $casts = [
        'fecha_inicio' => 'datetime',
        'fecha_fin' => 'datetime',
        'es_privada' => 'boolean',
        'activo' => 'boolean'
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }

    public function equipamiento()
    {
        return $this->belongsTo(Equipamiento::class, 'id_equipamiento', 'id_equipamiento');
    }

    public function ubicacion()
    {
        return $this->belongsTo(Ubicacion::class, 'id_ubicacion', 'id_ubicacion');
    }

    public function logs()
    {
        return $this->hasMany(LogIncidencia::class, 'id_incidencia', 'id_incidencia');
    }
} 