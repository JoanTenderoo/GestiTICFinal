<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\Incidencia;
use App\Models\LogIncidencia;
use App\Models\Equipamiento;
use App\Models\Ubicacion;
use App\Models\Usuario;
use App\Policies\IncidenciaPolicy;
use App\Policies\LogIncidenciaPolicy;
use App\Policies\EquipamientoPolicy;
use App\Policies\UbicacionPolicy;
use App\Policies\UsuarioPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Incidencia::class => IncidenciaPolicy::class,
        LogIncidencia::class => LogIncidenciaPolicy::class,
        Equipamiento::class => EquipamientoPolicy::class,
        Ubicacion::class => UbicacionPolicy::class,
        Usuario::class => UsuarioPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Definir las puertas (gates) para la autorización
        Gate::define('manage-incidencias', function ($user) {
            return $user->rol === 'admin' || $user->rol === 'tecnico';
        });

        Gate::define('manage-equipamiento', function ($user) {
            return $user->rol === 'admin' || $user->rol === 'tecnico';
        });

        Gate::define('manage-ubicaciones', function ($user) {
            return $user->rol === 'admin';
        });

        Gate::define('manage-usuarios', function ($user) {
            return $user->rol === 'admin';
        });
    }
} 