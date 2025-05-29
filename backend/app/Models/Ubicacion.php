<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ubicacion extends Model
{
    use HasFactory;

    protected $table = 'ubicaciones';
    protected $primaryKey = 'id_ubicacion';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'edificio',
        'planta',
        'aula',
        'observaciones',
    ];

    public function equipamiento()
    {
        return $this->hasMany(Equipamiento::class);
    }

    public function incidencias()
    {
        return $this->hasMany(Incidencia::class);
    }
} 