# 🌱 Seeder - Generador de Datos de Muestra

El seeder es una herramienta integrada que permite poblar la aplicación con datos de muestra realistas para facilitar las pruebas y demostraciones.

## 🚀 Características

### 📊 Datos Incluidos
- **8 Equipos de Fútbol Españoles**: Real Madrid, Barcelona, Atlético Madrid, Valencia, Sevilla, Betis, Athletic Bilbao, Real Sociedad
- **25+ Jugadores Reales**: Con datos como edad, posición, número de camiseta, nacionalidad
- **3 Torneos Diferentes**: Copa eliminatoria, Liga regular y torneo de verano
- **Partidos Automáticos**: Generación automática de fixtures y algunos resultados simulados

### 🎯 Opciones de Carga

1. **🌱 Cargar Todos los Datos**
   - Equipos completos con jugadores
   - Torneos con inscripciones automáticas
   - Generación de partidos y algunos resultados
   - **Tiempo estimado**: 2-3 segundos

2. **⚡ Carga Rápida**
   - Solo equipos y jugadores básicos
   - Ideal para pruebas rápidas
   - **Tiempo estimado**: 1 segundo

3. **🏆 Solo Torneos**
   - Requiere equipos existentes
   - Crea torneos y genera partidos automáticamente
   - **Tiempo estimado**: 1-2 segundos

## 🖥️ Uso desde la Interfaz

1. **Inicia sesión como administrador** (admin/admin123)
2. **Ve a la pestaña "🌱 Datos de Muestra"**
3. **Elige tu opción de carga** según tus necesidades
4. **Ve las estadísticas** actualizadas en tiempo real

## 💻 Uso desde Consola

El seeder también está disponible globalmente para uso avanzado:

```javascript
// Cargar todos los datos
await window.seedData.all()

// Carga rápida
await window.seedData.quick()

// Solo torneos
await window.seedData.tournaments()

// Ver estadísticas
window.seedData.stats()

// Limpiar todos los datos
window.seedData.clear()
```

## 📋 Datos Específicos Incluidos

### 🏟️ Equipos
- **Real Madrid CF**: Santiago Bernabéu, Carlo Ancelotti
- **FC Barcelona**: Camp Nou, Xavi Hernández  
- **Atletico Madrid**: Wanda Metropolitano, Diego Simeone
- **Valencia CF**: Mestalla, Rubén Baraja
- **Sevilla FC**: Ramón Sánchez-Pizjuán, José Luis Mendilibar
- **Real Betis**: Benito Villamarín, Manuel Pellegrini
- **Athletic Bilbao**: San Mamés, Ernesto Valverde
- **Real Sociedad**: Reale Arena, Imanol Alguacil

### ⚽ Jugadores Destacados
- **Vinicius Jr.** (Real Madrid) - Extremo #7
- **Lewandowski** (Barcelona) - Delantero #9
- **Griezmann** (Atlético) - Delantero #7
- **Iñaki Williams** (Athletic) - Delantero #9
- **Oyarzabal** (Real Sociedad) - Delantero #10
- Y muchos más...

### 🏆 Torneos
- **Copa de España 2024**: Eliminatoria con 8 equipos
- **Liga Primavera 2024**: Liga regular con 6 equipos
- **Torneo de Verano 2024**: Competición de pretemporada

## 🔧 Características Técnicas

### ✅ Validaciones Automáticas
- Números de camiseta únicos por equipo
- Emails automáticos para jugadores
- Teléfonos generados aleatoriamente
- Inscripciones automáticas a torneos

### 🎲 Simulación Inteligente
- Resultados realistas (0-3 goles por equipo)
- 30% de partidos completados automáticamente
- Progresión automática en torneos eliminatorios
- Cálculo de estadísticas y posiciones

### 🛡️ Seguridad
- Solo administradores pueden usar el seeder
- Confirmación requerida para limpiar datos
- Manejo de errores completo
- Logs detallados del proceso

## 📱 Compatibilidad

- ✅ **Navegadores modernos** (Chrome, Firefox, Safari, Edge)
- ✅ **Dispositivos móviles** (responsive design)
- ✅ **Local Storage** para persistencia
- ✅ **Sin dependencias externas**

## 🚨 Advertencias

- **⚠️ Limpieza de Datos**: La opción "Limpiar Todos los Datos" es irreversible
- **💾 Datos Locales**: Los datos se almacenan en localStorage del navegador
- **🔄 Recarga**: No es necesario recargar la página después del seeding
- **🎯 Solo Admin**: Funcionalidad limitada solo a administradores

## 🐛 Solución de Problemas

### Problema: "Error durante el seeding"
- **Solución**: Recarga la página e intenta de nuevo
- **Causa**: Posible conflicto con datos existentes

### Problema: "No se muestran los datos"
- **Solución**: Cambia de pestaña y regresa
- **Causa**: La vista necesita actualizarse

### Problema: Botones no responden
- **Solución**: Verifica que estés logueado como admin
- **Causa**: Permisos insuficientes

## 📈 Rendimiento

- **Tiempo de carga**: < 3 segundos para todos los datos
- **Memoria utilizada**: ~2MB en localStorage
- **Datos generados**: ~200 registros en total
- **Compatible con**: Hasta 1000+ registros sin problemas

¡El seeder hace que probar la aplicación sea súper fácil! 🎉
