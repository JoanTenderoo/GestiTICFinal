# 💻 GestiTIC
GestiTIC es un sistema web moderno y completo para la gestión integral del equipamiento tecnológico en organizaciones. Administra inventarios de equipos, gestiona ubicaciones, reporta y da seguimiento a incidencias técnicas con una interfaz intuitiva y responsive.

🔗 **Sistema de Gestión de Equipamiento IT**

---

## 🌟 Características

🎯 **Gestión Integral**: Equipamiento, Ubicaciones, Incidencias y Usuarios  
🔐 **Sistema de Roles**: Administrador, Técnico y Usuario con permisos diferenciados  
📊 **Dashboard Interactivo**: Estadísticas en tiempo real con animaciones  
🎫 **Ciclo de Vida Completo**: Seguimiento de incidencias desde reporte hasta resolución  
📍 **Mapeo de Ubicaciones**: Estructura jerárquica (Edificio → Planta → Aula)  
🔍 **Búsqueda Avanzada**: Filtrado en tiempo real en todas las tablas  
🎨 **Interfaz Moderna**: Diseño Material-UI con animaciones fluidas  
📱 **Responsive Design**: Optimizado para móviles, tablets y desktop  
🔒 **Seguridad Robusta**: Autenticación JWT con Laravel Sanctum  
🚀 **API RESTful**: Backend preparado para futuras integraciones  

---

## 🚀 Tecnologías

### Frontend
- **React** 19.0.0
- **Material-UI (MUI)** 7.1.0
- **Framer Motion** 11.0.3
- **React Router DOM** 7.5.3
- **Axios** 1.9.0
- **Vite** 6.3.1

### Backend
- **Laravel Framework** 12.0
- **PHP** 8.2+
- **Laravel Sanctum** 4.1
- **Eloquent ORM**
- **MySQL/SQLite**

### Herramientas
- **Composer** (Gestión dependencias PHP)
- **NPM** (Gestión dependencias Node.js)
- **ESLint** (Linting JavaScript)

---

## 📋 Requisitos del Sistema

- **Node.js** >= 18.0
- **PHP** >= 8.2
- **Composer** (última versión)
- **MySQL** >= 8.0 o **SQLite**
- **NPM** >= 9.0

---

## 👥 Roles y Permisos

### 🔧 Administrador
- ✅ Acceso completo al sistema
- ✅ Gestión de usuarios
- ✅ CRUD completo en todas las entidades
- ✅ Visualización de todas las incidencias


### 👤 Usuario Estándar
- ✅ Reporte de incidencias
- ✅ Visualización de sus propias incidencias
- ✅ Consulta de equipamiento
- ❌ Sin permisos de modificación

---

## 🎯 Funcionalidades Principales

### 📊 Dashboard
- **Panel de control unificado** para todas las operaciones
- **Acciones rápidas** para crear nuevos registros
- **Indicadores visuales** del estado del sistema

### 🎫 Gestión de Incidencias
- **Estados**: Pendiente → En Proceso → Resuelta → Cerrada
- **Prioridades**: Baja, Media, Alta, Urgente
- **Seguimiento completo** del ciclo de vida
- **Búsqueda y filtrado** avanzado

### 💻 Gestión de Equipamiento
- **Estados**: Operativo, Averiado, Reparación, Retirado
- **Inventario completo** con números de serie únicos
- **Relación con ubicaciones** físicas
- **Trazabilidad** de incidencias por equipo

### 📍 Gestión de Ubicaciones
- **Estructura jerárquica**: Edificio → Planta → Aula
- **Asignación de equipamiento** por ubicación
- **Validación de integridad** referencial

---

## 🎨 Interfaz de Usuario

### 🎨 Diseño Visual
- **Paleta corporativa** con Material-UI
- **Animaciones fluidas** con Framer Motion
- **Tipografía Poppins** para máxima legibilidad
- **Componentes responsive** adaptativos

### 📱 Responsive Design
- **Móviles**: Layout en columna, navegación drawer
- **Tablets**: Layout híbrido, algunas columnas ocultas  
- **Desktop**: Layout completo, sidebar fijo

### ✨ Características UX
- **Búsqueda en tiempo real** en todas las tablas
- **Modales intuitivos** para creación y edición
- **Estados visuales** con chips de color
- **Touch targets** optimizados para móviles

---

## 🔒 Seguridad

- 🔐 **Laravel Sanctum**: Autenticación basada en tokens
- 🛡️ **Validación de datos**: Frontend y backend
- 🚫 **Protección CSRF**: Tokens en formularios
- 🔍 **Sanitización**: Prevención XSS y SQL injection

---

## 🗄️ Base de Datos

### Entidades Principales
- **Usuarios**: Gestión de cuentas y roles
- **Ubicaciones**: Mapeo de espacios físicos
- **Equipamiento**: Inventario de dispositivos
- **Incidencias**: Registro de problemas técnicos

### Relaciones
- Usuario → Incidencias (1:N)
- Ubicación → Equipamiento (1:N)
- Equipamiento → Incidencias (1:N)

---

## 📚 Scripts Disponibles

### Frontend
```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run preview    # Preview del build
npm run lint       # Ejecutar ESLint
```

### Backend
```bash
php artisan serve                # Servidor de desarrollo
php artisan migrate             # Ejecutar migraciones
php artisan db:seed            # Datos de prueba
php artisan cache:clear        # Limpiar cache
php artisan optimize           # Optimizar aplicación
```

---

## 🤝 Contribuir

1. Haz **fork** del proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

---

## 📞 Soporte y Contacto

- 📧 **Email**: joatencam@alu.edu.gva.es
- 🐛 **Issues**: Reporta problemas en GitHub Issues
- 💬 **Soporte**: Contacta al equipo de desarrollo

---


## 👥 Autores

**Joan Tendero** - *Sistema GestiTIC v1.0*

---

## 🙏 Agradecimientos

- **Laravel Framework** - Backend robusto y escalable
- **React & Material-UI** - Interfaz moderna y componentes
- **Framer Motion** - Animaciones fluidas y profesionales
- **Vite** - Herramientas de desarrollo rápidas
- **Raúl Juan Martí** - Que me ha acompañado durante el desarrollo

---

**© 2025 GestiTIC - Sistema de Gestión de Equipamiento IT**