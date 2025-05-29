<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipamiento extends Model
{
    use HasFactory;

    protected $table = 'equipamiento';
    protected $primaryKey = 'id_equipamiento';
    public $timestamps = false;

    protected $fillable = [
        'id_ubicacion',
        'modelo',
        'numero_serie',
        'estado',
        'observaciones'
    ];

    public function ubicacion()
    {
        return $this->belongsTo(Ubicacion::class, 'id_ubicacion', 'id_ubicacion');
    }

    public function incidencias()
    {
        return $this->hasMany(Incidencia::class);
    }
} 