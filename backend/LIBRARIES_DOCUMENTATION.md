# AdoptaCat Backend - Librerías de Apoyo Incorporadas

## 🚀 Librerías Incorporadas

### 📚 **Google Guava**
**Versión**: 33.3.1-jre

**Funcionalidades implementadas**:
- **Preconditions**: Validación de parámetros con mensajes descriptivos
- **Strings**: Utilidades para manejo seguro de strings (isNullOrEmpty)
- **Lists**: Creación y manipulación eficiente de listas
- **Hashing**: Generación de hashes SHA-256 seguros
- **Collections**: Estructuras de datos inmutables y eficientes

**Uso en el proyecto**:
```java
// Validación de parámetros
Preconditions.checkArgument(!Strings.isNullOrEmpty(email), "El email no puede estar vacío");

// Generación de hash seguro
String hash = Hashing.sha256().hashString(input, StandardCharsets.UTF_8).toString();

// Manejo eficiente de listas
List<String> safeList = Lists.newArrayList();
```

### 📊 **Apache POI**
**Versión**: 5.3.0

**Funcionalidades implementadas**:
- **Generación de reportes Excel**: Exportación de datos de gatos y solicitudes
- **Múltiples hojas**: Organización de datos en hojas separadas
- **Estilos y formato**: Headers, bordes, colores y formato de fechas
- **Estadísticas**: Hojas de resumen ejecutivo y métricas

**Endpoints disponibles**:
- `GET /api/reports/cats` - Reporte de gatos en Excel
- `GET /api/reports/applications` - Reporte de solicitudes en Excel
- `GET /api/reports/complete` - Reporte completo con todas las hojas

### 🛠️ **Apache Commons**
**Versiones**:
- Commons Lang3: 3.17.0
- Commons Collections4: 4.4
- Commons IO: 2.17.0

**Funcionalidades implementadas**:

**Commons Lang3**:
```java
// Validación y normalización de strings
String normalizedName = StringUtils.normalizeSpace(trimmedName);
String capitalizedName = StringUtils.capitalize(normalizedName);

// Generación segura de strings aleatorios
String randomSuffix = RandomStringUtils.secure().nextAlphanumeric(4);
```

**Commons Collections4**:
```java
// Validación segura de colecciones
if (CollectionUtils.isEmpty(input)) {
    return Lists.newArrayList();
}
```

**Commons IO**:
```java
// Lectura/escritura segura de archivos
FileUtils.writeStringToFile(file, content, StandardCharsets.UTF_8);
String content = FileUtils.readFileToString(file, StandardCharsets.UTF_8);
```

### 📝 **Logback**
**Versión**: 1.5.8

**Configuraciones implementadas**:
- **Logging por ambiente**: Diferentes configuraciones para desarrollo y producción
- **Rotación de archivos**: Archivos de log rotativos por fecha y tamaño
- **Logging de auditoría**: Registro separado para acciones críticas
- **Logging de seguridad**: Eventos de seguridad en archivos específicos

**Archivos de log generados**:
- `adoptacat-dev.log` - Log de desarrollo
- `adoptacat-prod.log` - Log de producción
- `adoptacat-error.log` - Solo errores
- `adoptacat-security.log` - Eventos de seguridad
- `adoptacat-audit.log` - Auditoría de acciones críticas

## 🔒 **Consideraciones de Seguridad Implementadas**

### 1. **Validación y Sanitización de Datos**
```java
// Sanitización contra XSS
String sanitizedInput = Encode.forHtml(userInput);

// Validación de email con regex
Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$");

// Validación de longitud máxima
Preconditions.checkArgument(input.length() <= MAX_LENGTH, "Texto excede longitud máxima");
```

### 2. **OWASP Encoder**
**Versión**: 1.3.0
- Prevención de ataques XSS
- Sanitización de entrada de usuario
- Encoding seguro para logs

### 3. **Headers de Seguridad**
```java
// Content Security Policy
.contentSecurityPolicy("default-src 'self'; script-src 'self' 'unsafe-inline';...")

// HSTS (HTTP Strict Transport Security)
.httpStrictTransportSecurity(hstsConfig -> hstsConfig.maxAgeInSeconds(31536000))

// Frame Options (Clickjacking protection)
.frameOptions(frameOptions -> frameOptions.deny())
```

### 4. **Configuración CORS Segura**
```java
// Orígenes específicos permitidos
configuration.setAllowedOriginPatterns(Arrays.asList(
    "http://localhost:*",
    "https://adoptacat.com"
));
```

### 5. **Cifrado de Contraseñas**
```java
// BCrypt con factor de costo alto
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12);
}
```

### 6. **Validación de Rutas de Archivos**
```java
// Prevención de Path Traversal
String canonicalPath = file.getCanonicalPath();
if (!canonicalPath.startsWith(System.getProperty("user.dir"))) {
    throw new SecurityException("Ruta de archivo no permitida");
}
```

### 7. **Auditoría y Logging de Seguridad**
```java
// Log de auditoría para acciones críticas
utils.logAuditAction("CREATE_APPLICATION", userEmail, details);

// Log de eventos de seguridad
utils.logSecurityEvent("INVALID_EMAIL_ATTEMPT", request.getRemoteAddr(), details);
```

## 📁 **Estructura de Archivos Creados**

```
src/main/java/com/adoptacat/backend/
├── util/
│   └── AdoptaCatUtils.java          # Utilidades con Guava y Commons
├── service/
│   └── ExcelReportService.java      # Generación de reportes con POI
├── controller/
│   └── ReportController.java        # Endpoints para reportes
├── config/
│   ├── SecurityConfig.java          # Configuración de seguridad
│   └── CorsConfig.java              # Configuración CORS
└── exception/
    └── GlobalExceptionHandler.java  # Manejo global de excepciones

src/main/resources/
└── logback-spring.xml               # Configuración de Logback

logs/                                # Directorio de logs
├── adoptacat-dev.log
├── adoptacat-audit.log
└── adoptacat-security.log
```

## 🎯 **Beneficios Obtenidos**

### **Eficiencia**:
- ✅ Generación automatizada de IDs únicos
- ✅ Validación robusta de datos de entrada
- ✅ Manejo eficiente de colecciones
- ✅ Reportes Excel profesionales

### **Seguridad**:
- ✅ Prevención de ataques XSS
- ✅ Validación estricta de entrada
- ✅ Headers de seguridad configurados
- ✅ Auditoría completa de acciones

### **Mantenibilidad**:
- ✅ Logging estructurado por niveles
- ✅ Separación de concerns
- ✅ Código reutilizable
- ✅ Documentación de auditoría

### **Funcionalidad**:
- ✅ Reportes exportables en Excel
- ✅ Estadísticas detalladas
- ✅ Rotación automática de logs
- ✅ Múltiples formatos de salida

## 🚀 **Nuevos Endpoints Disponibles**

### **Reportes**:
- `GET /api/reports/cats` - Descargar reporte de gatos
- `GET /api/reports/applications` - Descargar reporte de solicitudes
- `GET /api/reports/complete` - Descargar reporte completo
- `GET /api/reports/health` - Estado del servicio de reportes

### **Ejemplos de Uso**:

```bash
# Descargar reporte de gatos
curl -X GET "http://localhost:8080/api/reports/cats" \
  -H "accept: application/octet-stream" \
  --output "reporte_gatos.xlsx"

# Descargar reporte completo
curl -X GET "http://localhost:8080/api/reports/complete" \
  -H "accept: application/octet-stream" \
  --output "reporte_completo.xlsx"
```

## 📋 **Próximos Pasos Recomendados**

1. **Configurar autenticación JWT** para endpoints administrativos
2. **Implementar rate limiting** para prevenir ataques de fuerza bruta
3. **Configurar monitoreo** con Micrometer y Prometheus
4. **Agregar tests unitarios** para las nuevas utilidades
5. **Configurar backup automático** de logs de auditoría

¡El backend ahora cuenta con librerías de apoyo profesionales que mejoran significativamente la eficiencia, seguridad y funcionalidad del proyecto! 🎉