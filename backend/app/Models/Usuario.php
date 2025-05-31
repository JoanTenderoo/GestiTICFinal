<?php

/**
 * MODELO USUARIO - Patrón Active Record de Eloquent
 * 
 * Este modelo representa la tabla 'usuarios' en la base de datos.
 * Eloquent ORM permite trabajar con la BD usando objetos PHP en lugar de SQL.
 * 
 * Funcionalidades:
 * - Autenticación de usuarios (hereda de Authenticatable)
 * - Gestión de tokens API (trait HasApiTokens)
 * - Relaciones con otras tablas (incidencias, logs)
 * - Mass assignment protection (fillable/guarded)
 */

namespace App\Models;

// Traits de Laravel para funcionalidades específicas
use Illuminate\Database\Eloquent\Factories\HasFactory; // Para seeders y factories
use Illuminate\Foundation\Auth\User as Authenticatable; // Para autenticación
use Illuminate\Notifications\Notifiable; // Para envío de notificaciones
use Laravel\Sanctum\HasApiTokens; // Para tokens de API

class Usuario extends Authenticatable
{
    // TRAITS - Mixins que añaden funcionalidades al modelo
    use HasApiTokens,   // Permite crear tokens de acceso para APIs
        HasFactory,     // Permite usar factories para crear datos de prueba
        Notifiable;     // Permite enviar notificaciones (email, SMS, etc.)

    // CONFIGURACIÓN DE LA TABLA
    
    /**
     * Nombre de la tabla en la base de datos
     * Por convención Laravel buscaría 'users', pero nuestra tabla se llama 'usuarios'
     */
    protected $table = 'usuarios';
    
    /**
     * Clave primaria personalizada
     * Por defecto Laravel busca 'id', pero nuestra tabla usa 'id_usuario'
     */
    protected $primaryKey = 'id_usuario';

    // MASS ASSIGNMENT PROTECTION
    
    /**
     * Campos que se pueden asignar masivamente
     * Solo estos campos pueden ser llenados con create() o fill()
     * SEGURIDAD: Previene ataques de mass assignment
     */
    protected $fillable = [
        'nombre',
        'apellidos', 
        'email',
        'password',
        'rol',
        'departamento',
        'telefono'
    ];

    /**
     * Campos que se ocultan en las respuestas JSON
     * Nunca se mostrarán cuando el modelo se serialice (toJson(), toArray())
     * SEGURIDAD: Protege información sensible
     */
    protected $hidden = [
        'password',      // Nunca devolver la contraseña
        'remember_token', // Token para "recordar sesión"
    ];

    // CASTING DE DATOS
    
    /**
     * Conversión automática de tipos de datos
     * Laravel convierte automáticamente estos campos al tipo especificado
     */
    protected $casts = [
        'email_verified_at' => 'datetime', // String DB -> Carbon datetime object
        'password' => 'hashed',            // Auto-hash cuando se asigna (Laravel 10+)
    ];

    // MÉTODOS DE AUTENTICACIÓN PERSONALIZADOS
    
    /**
     * Obtener la contraseña para autenticación
     * Método requerido por la interfaz Authenticatable
     * 
     * @return string - Contraseña hasheada
     */
    public function getAuthPassword()
    {
        return $this->password;
    }

    /**
     * Obtener el nombre del campo que identifica al usuario
     * Por defecto sería 'id', pero queremos usar 'email'
     * 
     * @return string - Nombre del campo identificador
     */
    public function getAuthIdentifierName()
    {
        return 'email';
    }

    /**
     * Obtener el valor del identificador de autenticación
     * 
     * @return mixed - Valor del email del usuario
     */
    public function getAuthIdentifier()
    {
        return $this->email;
    }

    // RELACIONES ELOQUENT
    
    /**
     * RELACIÓN UNO A MUCHOS: Un usuario puede tener muchas incidencias
     * 
     * Uso: $usuario->incidencias; // Obtiene todas las incidencias del usuario
     * SQL equivalente: SELECT * FROM incidencias WHERE id_usuario = ?
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function incidencias()
    {
        return $this->hasMany(Incidencia::class, 'id_usuario', 'id_usuario');
    }

    /**
     * RELACIÓN UNO A MUCHOS: Un usuario puede tener muchos logs de incidencias
     * 
     * Los logs registran las acciones que realiza cada usuario
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function logs()
    {
        return $this->hasMany(LogIncidencia::class, 'id_usuario', 'id_usuario');
    }
} 