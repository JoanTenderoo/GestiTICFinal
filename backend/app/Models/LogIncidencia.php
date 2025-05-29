<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogIncidencia extends Model
{
    use HasFactory;

    protected $table = 'logs_incidencias';

    protected $fillable = [
        'incidencia_id',
        'usuario_id',
        'accion',
        'descripcion'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function incidencia()
    {
        return $this->belongsTo(Incidencia::class);
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }
} 