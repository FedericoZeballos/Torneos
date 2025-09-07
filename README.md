# 🏆 Tournament Manager - Sistema de Gestión de Torneos

Un sistema completo y moderno para la gestión y organización de torneos deportivos, desarrollado con tecnologías web estándar.

![Tournament Manager](https://img.shields.io/badge/Version-1.0.0-blue)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 📋 Descripción

Tournament Manager es una aplicación web profesional diseñada para facilitar la organización y administración de torneos deportivos. Permite gestionar equipos, jugadores, fixtures, resultados y standings de manera intuitiva y eficiente.

### ✨ Características Principales

- 🔐 **Sistema de Autenticación**: Login seguro con roles (Administrador/Usuario)
- 🏆 **Gestión de Torneos**: Creación y administración completa de torneos
- 👥 **Gestión de Equipos**: Registro y administración de equipos participantes
- ⚽ **Gestión de Jugadores**: Control detallado de roster de jugadores
- 📅 **Gestión de Partidos**: Programación y seguimiento de encuentros
- 🏅 **Fixtures y Resultados**: Generación automática de fixture y registro de resultados
- 📊 **Tablas de Posiciones**: Cálculo automático de standings
- 📱 **Diseño Responsivo**: Optimizado para desktop, tablet y móvil
- 🎨 **Interfaz Moderna**: Diseño clean con efectos visuales atractivos

## 🚀 Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Estilos**: CSS Grid, Flexbox, Custom Properties (CSS Variables)
- **Almacenamiento**: localStorage para persistencia de datos
- **Tipografía**: Google Fonts (Inter)
- **Iconos**: Emojis nativos para mejor compatibilidad

## 📦 Instalación y Configuración

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional para desarrollo)

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/tournament-manager.git
   cd tournament-manager
   ```

2. **Servir los archivos**
   
   **Opción 1: Servidor HTTP simple con Python**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -SimpleHTTPServer 8000
   ```
   
   **Opción 2: Servidor HTTP simple con Node.js**
   ```bash
   npx http-server
   ```
   
   **Opción 3: Abrir directamente en el navegador**
   - Simplemente abre el archivo `index.html` en tu navegador

3. **Acceder a la aplicación**
   - URL: `http://localhost:8000` (si usas servidor local)
   - O directamente desde el archivo `index.html`

## 👨‍💻 Uso de la Aplicación

### Primeros Pasos

1. **Acceso inicial**
   - La aplicación incluye usuarios por defecto:
     - **Administrador**: `admin` / `admin123`
     - **Usuario**: `user` / `user123`

2. **Crear nuevo usuario**
   - Haz clic en "Register"
   - Completa el formulario con:
     - Nombre de usuario (3+ caracteres, solo letras, números y guiones bajos)
     - Contraseña (6+ caracteres, debe incluir letras y números)
     - Selecciona el rol (Usuario o Administrador)

### Funcionalidades por Rol

#### 👑 Administrador
- ✅ Crear, editar y eliminar torneos
- ✅ Gestionar equipos y jugadores
- ✅ Programar partidos y registrar resultados
- ✅ Generar fixtures automáticamente
- ✅ Gestionar inscripciones de equipos en torneos

#### 👤 Usuario Regular
- ✅ Ver torneos disponibles
- ✅ Consultar equipos y jugadores
- ✅ Ver fixtures y resultados
- ✅ Consultar tablas de posiciones

### Gestión de Torneos

1. **Crear Torneo**
   - Nombre del torneo (obligatorio)
   - Descripción y reglas
   - Fechas de inicio y fin
   - Formato: Liga (todos contra todos) o Eliminatoria
   - Número máximo de equipos (2-64)

2. **Inscribir Equipos**
   - Acceder al torneo deseado
   - Usar "Gestionar Equipos" para inscribir/desinscribir equipos

3. **Generar Fixture**
   - Una vez inscritos los equipos, generar el fixture automáticamente
   - El sistema creará todos los partidos necesarios

### Gestión de Equipos

1. **Crear Equipo**
   - Nombre del equipo (obligatorio)
   - Información adicional: entrenador, sede, fecha de fundación
   - Descripción del equipo

2. **Gestionar Jugadores**
   - Agregar jugadores al roster del equipo
   - Asignar números de camiseta únicos
   - Información completa: posición, edad, nacionalidad, contacto

### Registro de Resultados

1. **Programar Partidos**
   - Fecha y hora del encuentro
   - Venue/cancha
   - Ronda del torneo

2. **Registrar Resultados**
   - Introducir marcador final
   - Notas adicionales del partido
   - El sistema actualiza automáticamente las tablas de posiciones

## 🏗️ Estructura del Proyecto

```
tournament-manager/
├── index.html          # Página principal
├── styles.css          # Estilos CSS principales
├── app.js              # Controlador principal de la aplicación
├── auth.js             # Sistema de autenticación
├── data.js             # Simulador de base de datos (localStorage)
├── tournament.js       # Gestión de torneos
├── team.js             # Gestión de equipos
├── player.js           # Gestión de jugadores
├── match.js            # Gestión de partidos
├── README.md           # Este archivo
└── SEEDER.md           # Documentación para poblar datos de prueba
```

### Arquitectura del Código

- **Modular**: Cada funcionalidad en archivos separados
- **Orientado a Objetos**: Clases para cada manager (Tournament, Team, Player, Match)
- **Separación de Responsabilidades**: UI, lógica de negocio y datos separados
- **Validaciones**: Frontend y backend para integridad de datos

## 🎨 Características del Diseño

### Sistema de Colores
- **Primario**: Azul moderno (#2563eb)
- **Secundario**: Grises neutros (#64748b)
- **Estado**: Verde éxito, Rojo error, Amarillo advertencia
- **Fondo**: Gradientes suaves y sombras modernas

### Tipografía
- **Fuente**: Inter (Google Fonts)
- **Jerarquía**: Tamaños consistentes y pesos variables
- **Legibilidad**: Alto contraste y espaciado óptimo

### Componentes UI
- **Botones**: Gradientes, efectos hover y estados de carga
- **Cards**: Sombras, hover effects y animaciones sutiles
- **Modales**: Blur backdrop y animaciones de entrada
- **Formularios**: Validación visual y feedback inmediato

## 📱 Responsive Design

### Breakpoints
- **Desktop**: > 1200px
- **Tablet**: 768px - 1200px
- **Mobile**: < 768px
- **Small Mobile**: < 480px

### Adaptaciones Móviles
- Header colapsable
- Navegación por pestañas horizontal scroll
- Formularios stack vertical
- Botones de acción full-width
- Tablas responsive con scroll horizontal

## 🔒 Validaciones y Seguridad

### Frontend
- Validación de campos obligatorios
- Formato de email y patrones de texto
- Validación de fechas y rangos numéricos
- Feedback visual inmediato

### Backend (simulado)
- Verificación de permisos por rol
- Validación de integridad de datos
- Prevención de duplicados
- Validaciones de lógica de negocio

## 📊 Gestión de Datos

### LocalStorage
- Persistencia automática de datos
- Estructuras JSON organizadas
- IDs únicos autoincrementales
- Timestamps de creación y actualización

### Colecciones de Datos
- `users`: Usuarios del sistema
- `tournaments`: Torneos creados
- `teams`: Equipos registrados
- `players`: Jugadores del sistema
- `matches`: Partidos programados y completados

## 🛠️ Personalización y Extensiones

### Agregar Nuevas Funcionalidades
1. Crear nuevo archivo JS para la funcionalidad
2. Extender la clase correspondiente
3. Agregar rutas en el controlador principal
4. Implementar UI en HTML/CSS

### Modificar Estilos
- Usar variables CSS en `:root` para cambios globales
- Estructura modular para modificaciones específicas
- Sistema de utilidades para rapidez de desarrollo

## 🚧 Limitaciones Conocidas

- **Almacenamiento**: Limitado por localStorage del navegador
- **Concurrencia**: No soporta múltiples usuarios simultáneos
- **Backup**: Los datos se almacenan localmente sin backup automático
- **Escalabilidad**: Diseñado para uso local, no para producción distribuida

## 🔮 Futuras Mejoras

### Funcionalidades Planeadas
- [ ] Exportación de datos (PDF, Excel)
- [ ] Sistema de notificaciones
- [ ] Estadísticas avanzadas de jugadores
- [ ] Integración con APIs deportivas
- [ ] Sistema de brackets visuales
- [ ] Chat en tiempo real
- [ ] Aplicación móvil nativa

### Mejoras Técnicas
- [ ] Migración a base de datos real
- [ ] API RESTful backend
- [ ] Autenticación JWT
- [ ] Progressive Web App (PWA)
- [ ] Testing automatizado
- [ ] CI/CD pipeline

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Pautas de Contribución
- Mantén el estilo de código consistente
- Agrega comentarios para código complejo
- Asegúrate de que las validaciones funcionen
- Testa en múltiples navegadores
- Actualiza la documentación si es necesario

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial* - [TuPerfil](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- Inspirado en sistemas de gestión deportiva modernos
- Diseño influenced by modern web applications
- Community feedback and suggestions

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:

- **Issues**: [GitHub Issues](https://github.com/tu-usuario/tournament-manager/issues)
- **Email**: tu-email@ejemplo.com
- **Documentación**: Este README y comentarios en el código

---

**¡Disfruta organizando tus torneos con Tournament Manager!** 🏆⚽🏀🎾
