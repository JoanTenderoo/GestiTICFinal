<?php

namespace App\Enums;

enum PrioridadIncidencia: string
{
    case BAJA = 'Baja';
    case MEDIA = 'Media';
    case ALTA = 'Alta';
    case URGENTE = 'Urgente';
} 