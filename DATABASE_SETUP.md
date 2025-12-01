# 🐱 AdoptaCat - Conexión con Base de Datos

## ✅ **Implementación Completada**

He implementado completamente la **conexión con la base de datos** y el **guardado de datos del perfil de adopción**. Ahora el formulario está conectado al backend y guarda los datos en MySQL.

---

## 🏗️ **Arquitectura Implementada**

### **Backend (Spring Boot)**
- ✅ **Modelo**: `AdoptionProfile.java` - Entidad JPA con todas las validaciones
- ✅ **Repository**: `AdoptionProfileRepository.java` - Operaciones de base de datos
- ✅ **Service**: `AdoptionProfileService.java` - Lógica de negocio
- ✅ **Controller**: `AdoptionProfileController.java` - API REST endpoints
- ✅ **DTO**: `AdoptionProfileDTO.java` - Transfer object con validaciones
- ✅ **Mapper**: `AdoptionProfileMapper.java` - Conversión DTO ↔ Entidad

### **Frontend (Angular)**
- ✅ **Service**: `adoption-profile.service.ts` - Cliente HTTP para consumir API
- ✅ **Component**: `profile.component.ts` - Formulario conectado al backend
- ✅ **Validaciones**: Frontend y backend sincronizadas

### **Base de Datos (MySQL)**
- ✅ **Tabla**: `adoption_profiles` - Esquema completo agregado al SQL
- ✅ **Relaciones**: Conexión opcional con tabla `users`
- ✅ **Índices**: Optimización para consultas frecuentes

---

## 🚀 **Configuración Rápida**

### **1. Configurar Base de Datos**
```bash
# Crear la base de datos
mysql -u root -p < backend/database/adoptacat_database.sql
```

### **2. Configurar Variables de Entorno**
Crea un archivo `.env` en la raíz del proyecto:
```env
# Configuración del servidor
SERVER_PORT=8080

# Configuración de la base de datos MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=adoptacat_db
DB_USER=root
DB_PASS=tu_contraseña_mysql

# Configuración OAuth2 con Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8080/login/oauth2/code/google

# Perfil de Spring
SPRING_PROFILES_ACTIVE=dev
```

### **3. Ejecutar la Aplicación**
```bash
# Terminal 1 - Backend
cd backend
mvn spring-boot:run

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

### **4. Probar la Funcionalidad**
1. Ve a: `http://localhost:4200/profile`
2. Llena el formulario de adopción
3. Envía el formulario
4. ✅ Los datos se guardan en `adoption_profiles` table

---

## 📡 **API REST Endpoints**

### **Perfiles de Adopción**
```http
POST   /api/adoption-profiles           # Crear/actualizar perfil
GET    /api/adoption-profiles/{id}      # Obtener por ID
GET    /api/adoption-profiles/by-email/{email}  # Obtener por email
GET    /api/adoption-profiles           # Obtener todos (admin)
GET    /api/adoption-profiles/status/{status}   # Obtener por estado
GET    /api/adoption-profiles/pending   # Obtener pendientes
PUT    /api/adoption-profiles/{id}/status      # Actualizar estado
DELETE /api/adoption-profiles/{id}      # Eliminar perfil
GET    /api/adoption-profiles/exists/{email}   # Verificar existencia
GET    /api/adoption-profiles/statistics       # Estadísticas
```

### **Estados de Perfil**
- `PENDING` - Pendiente de revisión
- `APPROVED` - Aprobado 
- `REJECTED` - Rechazado
- `UNDER_REVIEW` - En revisión

---

## 📊 **Estructura de Datos**

### **Tabla: adoption_profiles**
```sql
- Información Personal: nombre, email, teléfono, DNI, dirección
- Experiencia con Mascotas: historial, razones para adoptar
- Información del Hogar: familia, espacio, condiciones
- Compromiso de Cuidados: veterinario, esterilización, cuidados
- Estado y Seguimiento: status, timestamps, user_id
```

---

## 🔧 **Características Técnicas**

### **Validaciones**
- ✅ **Frontend**: Validaciones reactivas en Angular
- ✅ **Backend**: Validaciones con Bean Validation
- ✅ **Base de Datos**: Constraints y tipos de datos

### **Seguridad**
- ✅ **CORS**: Configurado para desarrollo
- ✅ **Validación**: Datos sanitizados y validados
- ✅ **Logging**: Auditoría completa de operaciones

### **Manejo de Errores**
- ✅ **Try-Catch**: Captura de excepciones específicas
- ✅ **Respuestas**: Formato JSON consistente
- ✅ **Logging**: Contexto detallado para debugging

---

## 🎯 **Flujo de Datos Completo**

```
[Angular Form] 
    ↓ (HTTP POST)
[AdoptionProfileController] 
    ↓ (DTO → Entity)
[AdoptionProfileService] 
    ↓ (Business Logic)
[AdoptionProfileRepository] 
    ↓ (JPA/Hibernate)
[MySQL Database]
    ↓ (adoption_profiles table)
[Data Persisted] ✅
```

---

## 🧪 **Pruebas**

### **Verificar Conexión**
```bash
# Verificar que el backend esté ejecutándose
curl http://localhost:8080/api/adoption-profiles/statistics

# Respuesta esperada:
{
  "status": "success",
  "data": {
    "pending": 0,
    "approved": 0,
    "rejected": 0,
    "under_review": 0
  }
}
```

### **Crear Perfil de Prueba**
1. Ve a `http://localhost:4200/profile`
2. Llena todos los campos requeridos
3. Haz clic en "Enviar"
4. Verifica en la base de datos:
```sql
SELECT * FROM adoption_profiles ORDER BY created_at DESC LIMIT 1;
```

---

## 🔍 **Troubleshooting**

### **Error de Conexión a Base de Datos**
- Verifica que MySQL esté ejecutándose
- Confirma las credenciales en `.env`
- Asegúrate de que la base de datos `adoptacat_db` exista

### **Error CORS**
- Verifica que el frontend esté en `http://localhost:4200`
- El backend tiene CORS configurado para ese origen

### **Error de Validación**
- Revisa que todos los campos requeridos estén llenos
- Los mensajes de error aparecen en la consola del navegador

---

## 🎉 **Resultado Final**

✅ **Base de datos conectada y configurada**
✅ **Formulario de perfil guarda datos en MySQL**
✅ **API REST completa y funcional**
✅ **Validaciones frontend y backend**
✅ **Manejo de errores robusto**
✅ **Arquitectura escalable y mantenible**

**¡El sistema está listo para recibir y procesar formularios de adopción!** 🐱💾