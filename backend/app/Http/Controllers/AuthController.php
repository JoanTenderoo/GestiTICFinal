<?php

/**
 * CONTROLADOR DE AUTENTICACIÓN
 * 
 * Este controlador maneja todas las operaciones relacionadas con la autenticación:
 * - Registro de nuevos usuarios
 * - Login/logout de usuarios
 * - Gestión de tokens de acceso
 * - Cambio de contraseñas
 * 
 * Patrón MVC: Este es el CONTROLADOR que recibe peticiones HTTP,
 * procesa la lógica de negocio y devuelve respuestas JSON
 */

namespace App\Http\Controllers;

// Importación del modelo Usuario (patrón Active Record de Eloquent)
use App\Models\Usuario;

// Clases principales de Laravel para manejo de requests y respuestas
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; // Para cifrado seguro de contraseñas
use Illuminate\Support\Facades\Auth; // Para autenticación de Laravel
use Illuminate\Validation\ValidationException; // Para manejo de errores de validación
use Illuminate\Support\Str; // Utilidades para strings
use Illuminate\Support\Facades\DB; // Query Builder de Laravel

class AuthController extends Controller
{
    /**
     * REGISTRO DE NUEVOS USUARIOS
     * Endpoint: POST /api/register
     * 
     * @param Request $request - Objeto que contiene todos los datos de la petición HTTP
     * @return \Illuminate\Http\JsonResponse - Respuesta JSON con usuario y token
     */
    public function register(Request $request)
    {
        try {
            // VALIDACIÓN DE DATOS DE ENTRADA
            // Laravel valida automáticamente los datos antes de procesarlos
            $request->validate([
                // Reglas de validación: required=obligatorio, string=texto, max=longitud máxima
                'nombre' => 'required|string|max:255',
                'apellidos' => 'required|string|max:255',
                // unique:usuarios = verifica que el email no exista en la tabla usuarios
                'email' => 'required|string|email|max:255|unique:usuarios',
                // confirmed = debe venir acompañado de password_confirmation con el mismo valor
                'password' => 'required|string|min:8|confirmed',
                // in: = solo acepta valores específicos, nullable = puede ser null
                'rol' => 'nullable|string|in:usuario,tecnico,admin',
                'departamento' => 'nullable|string|max:255'
            ], [
                // MENSAJES PERSONALIZADOS DE ERROR
                // Formato: 'campo.regla' => 'mensaje personalizado'
                'nombre.required' => 'El nombre es obligatorio.',
                'nombre.string' => 'El nombre debe ser un texto válido.',
                'nombre.max' => 'El nombre no puede tener más de 255 caracteres.',
                'apellidos.required' => 'Los apellidos son obligatorios.',
                'apellidos.string' => 'Los apellidos deben ser un texto válido.',
                'apellidos.max' => 'Los apellidos no pueden tener más de 255 caracteres.',
                'email.required' => 'El email es obligatorio.',
                'email.string' => 'El email debe ser un texto válido.',
                'email.email' => 'El email debe tener un formato válido.',
                'email.max' => 'El email no puede tener más de 255 caracteres.',
                'email.unique' => 'Este email ya está registrado en el sistema.',
                'password.required' => 'La contraseña es obligatoria.',
                'password.string' => 'La contraseña debe ser un texto válido.',
                'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
                'password.confirmed' => 'La confirmación de contraseña no coincide.',
                'rol.in' => 'El rol seleccionado no es válido.',
                'departamento.max' => 'El departamento no puede tener más de 255 caracteres.'
            ]);

            // CREACIÓN DEL USUARIO CON ELOQUENT ORM
            // Usuario::create() usa el patrón Active Record para insertar en BD
            $usuario = Usuario::create([
                'nombre' => $request->nombre,
                'apellidos' => $request->apellidos,
                'email' => $request->email,
                // Hash::make() cifra la contraseña usando bcrypt (seguro)
                'password' => Hash::make($request->password),
                // Operador null coalescing (??) - si es null, usa el valor por defecto
                'rol' => $request->rol ?? 'usuario',
                'departamento' => $request->departamento ?? 'General'
            ]);

            // GENERACIÓN DE TOKEN DE ACCESO
            // Laravel Sanctum crea un token único para este usuario
            $token = $usuario->createToken('auth_token')->plainTextToken;

            // RESPUESTA JSON EXITOSA
            // Código 201 = Created (recurso creado exitosamente)
            return response()->json([
                'usuario' => $usuario,
                'token' => $token
            ], 201);
            
        } catch (ValidationException $e) {
            // MANEJO DE ERRORES DE VALIDACIÓN
            // Código 422 = Unprocessable Entity (datos incorrectos)
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors() // Array con todos los errores específicos
            ], 422);
            
        } catch (\Exception $e) {
            // MANEJO DE ERRORES GENERALES
            // Código 500 = Internal Server Error
            return response()->json([
                'message' => 'Error al registrar usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * INICIO DE SESIÓN
     * Endpoint: POST /api/login
     * 
     * @param Request $request - Datos de login (email y password)
     * @return \Illuminate\Http\JsonResponse - Usuario y token si es correcto
     */
    public function login(Request $request)
    {
        try {
            // Validación básica de campos requeridos
            $request->validate([
                'email' => 'required|email',
                'password' => 'required'
            ], [
                'email.required' => 'El email es obligatorio.',
                'email.email' => 'El email debe tener un formato válido.',
                'password.required' => 'La contraseña es obligatoria.'
            ]);

            // BÚSQUEDA DEL USUARIO POR EMAIL
            // where() genera SQL: SELECT * FROM usuarios WHERE email = ?
            $usuario = Usuario::where('email', $request->email)->first();

            // VERIFICACIÓN DE CREDENCIALES
            // Hash::check() compara la contraseña en texto plano con el hash almacenado
            if (!$usuario || !Hash::check($request->password, $usuario->password)) {
                // ValidationException para errores de credenciales
                throw ValidationException::withMessages([
                    'email' => ['Las credenciales proporcionadas son incorrectas.'],
                ]);
            }

            // Generar nuevo token de acceso para la sesión
            $token = $usuario->createToken('auth_token')->plainTextToken;

            // Respuesta exitosa con datos del usuario y token
            return response()->json([
                'usuario' => $usuario,
                'token' => $token
            ]);
            
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al iniciar sesión',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * CIERRE DE SESIÓN
     * Endpoint: POST /api/logout
     * Requiere autenticación (middleware auth:sanctum)
     * 
     * @param Request $request - Request autenticado con usuario
     * @return \Illuminate\Http\JsonResponse - Confirmación de logout
     */
    public function logout(Request $request)
    {
        try {
            // ELIMINACIÓN DEL TOKEN ACTUAL
            // $request->user() obtiene el usuario autenticado por el token
            // currentAccessToken() obtiene el token usado en esta petición
            // delete() elimina el token de la base de datos
            $request->user()->currentAccessToken()->delete();
            
            return response()->json(['message' => 'Sesión cerrada correctamente']);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al cerrar sesión',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * OBTENER DATOS DEL USUARIO ACTUAL
     * Endpoint: GET /api/user
     * Requiere autenticación
     * 
     * @param Request $request - Request autenticado
     * @return \Illuminate\Http\JsonResponse - Datos del usuario logueado
     */
    public function user(Request $request)
    {
        try {
            // Devuelve los datos del usuario autenticado
            return response()->json($request->user());
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener información del usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * CAMBIO DE CONTRASEÑA
     * Endpoint: POST /api/change-password
     * 
     * @param Request $request - Email y nueva contraseña
     * @return \Illuminate\Http\JsonResponse - Confirmación del cambio
     */
    public function changePassword(Request $request)
    {
        try {
            $request->validate([
                // exists:usuarios,email = verifica que el email exista en la tabla usuarios
                'email' => 'required|email|exists:usuarios,email',
                'password' => 'required|string|min:8'
            ], [
                'email.required' => 'El email es obligatorio.',
                'email.email' => 'El email debe tener un formato válido.',
                'email.exists' => 'No existe un usuario con este email.',
                'password.required' => 'La contraseña es obligatoria.',
                'password.string' => 'La contraseña debe ser un texto válido.',
                'password.min' => 'La contraseña debe tener al menos 8 caracteres.'
            ]);

            // Buscar y actualizar la contraseña
            $usuario = Usuario::where('email', $request->email)->first();
            $usuario->password = Hash::make($request->password); // Cifrar nueva contraseña
            $usuario->save(); // Guardar cambios en la base de datos

            return response()->json([
                'message' => 'Contraseña actualizada correctamente'
            ]);
            
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al cambiar la contraseña',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 