<?php

namespace App\Enums;

enum EstadoIncidencia: string
{
    case PENDIENTE = 'Pendiente';
    case EN_PROCESO = 'En Proceso';
    case RESUELTA = 'Resuelta';
    case CERRADA = 'Cerrada';
} 