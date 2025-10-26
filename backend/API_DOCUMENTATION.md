# AdoptaCat Backend API

Backend desarrollado en Spring Boot para la aplicación AdoptaCat - Sistema de adopción de gatos.

## 🚀 Tecnologías

- **Spring Boot 3.5.7**
- **Java 21**
- **MySQL 8.0**
- **JPA/Hibernate**
- **Maven**

## 📁 Estructura del Proyecto

```
src/main/java/com/adoptacat/backend/
├── model/                  # Entidades JPA
│   ├── Cat.java
│   ├── AdoptionApplication.java
│   └── ...
├── repository/             # Repositorios JPA
│   ├── CatRepository.java
│   └── AdoptionApplicationRepository.java
├── service/                # Lógica de negocio
│   ├── CatService.java
│   └── AdoptionApplicationService.java
├── controller/             # Controladores REST
│   ├── CatController.java
│   └── AdoptionApplicationController.java
├── dto/                    # DTOs para transferencia de datos
│   ├── CatDTO.java
│   └── AdoptionApplicationDTO.java
├── mapper/                 # Mappers entre entidades y DTOs
│   └── CatMapper.java
├── config/                 # Configuraciones
│   └── CorsConfig.java
└── exception/              # Manejo de excepciones
    └── GlobalExceptionHandler.java
```

## 🛠️ Configuración

### Configuración de Base de Datos

El archivo `application.properties` utiliza variables de entorno del archivo `.env`:

```properties
spring.application.name=backend
server.port=${SERVER_PORT}

# Configuración de la base de datos MySQL
spring.datasource.url=jdbc:mysql://${DB_HOST}:${DB_PORT}/${DB_NAME}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASS}

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

### Archivo .env

```env
SERVER_PORT=8080
DB_HOST=localhost
DB_PORT=3306
DB_NAME=adoptacat_db
DB_USER=root
DB_PASS=junior22Ger+
SPRING_PROFILES_ACTIVE=dev
```

## 📊 Modelo de Datos

### Entidad Cat

```java
@Entity
@Table(name = "cats")
public class Cat {
    @Id
    private String id;
    private String name;
    private String breed;
    private String age;
    private Gender gender;
    private Size size;
    private String mainImageUrl;
    private String description;
    private String story;
    private String personality;
    private HealthStatus healthStatus;
    private Boolean isVaccinated;
    private Boolean isSterilized;
    private Boolean isSpecialNeeds;
    private ActivityLevel activityLevel;
    private AdoptionStatus adoptionStatus;
    // ... más campos
}
```

### Entidad AdoptionApplication

```java
@Entity
@Table(name = "adoption_applications")
public class AdoptionApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    private Cat cat;
    
    private String applicationNumber;
    private String fullName;
    private String email;
    private String phone;
    // ... información del candidato
    
    // Experiencia con mascotas
    private String whyAdopt;
    private Boolean hasCurrentPets;
    // ... más campos
    
    // Estado de la solicitud
    private ApplicationStatus status;
    // ... más campos
}
```

## 🌐 API Endpoints

### Gatos (Cats)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/cats/available` | Obtener todos los gatos disponibles |
| GET | `/api/cats` | Obtener gatos con paginación |
| GET | `/api/cats/{id}` | Obtener gato por ID |
| GET | `/api/cats/available/{id}` | Obtener gato disponible por ID |
| GET | `/api/cats/featured` | Obtener gatos destacados |
| GET | `/api/cats/recent-arrivals` | Obtener gatos recién llegados |
| GET | `/api/cats/search?name={name}` | Buscar gatos por nombre |
| GET | `/api/cats/breed/{breed}` | Buscar por raza |
| GET | `/api/cats/filter` | Filtros avanzados |
| POST | `/api/cats` | Crear nuevo gato (Admin) |
| PUT | `/api/cats/{id}` | Actualizar gato (Admin) |
| PATCH | `/api/cats/{id}/adopt` | Marcar como adoptado (Admin) |
| PATCH | `/api/cats/{id}/available` | Marcar como disponible (Admin) |
| DELETE | `/api/cats/{id}` | Eliminar gato (Admin) |
| GET | `/api/cats/stats` | Estadísticas de gatos |

### Solicitudes de Adopción

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/adoption-applications` | Crear nueva solicitud |
| GET | `/api/adoption-applications` | Obtener todas las solicitudes (Admin) |
| GET | `/api/adoption-applications/{id}` | Obtener solicitud por ID |
| GET | `/api/adoption-applications/number/{number}` | Obtener por número de aplicación |
| GET | `/api/adoption-applications/status/{status}` | Obtener por estado |
| GET | `/api/adoption-applications/cat/{catId}` | Obtener solicitudes para un gato |
| GET | `/api/adoption-applications/user/{email}` | Obtener solicitudes de un usuario |
| GET | `/api/adoption-applications/search` | Buscar con filtros |
| PATCH | `/api/adoption-applications/{id}/approve` | Aprobar solicitud (Admin) |
| PATCH | `/api/adoption-applications/{id}/reject` | Rechazar solicitud (Admin) |
| PATCH | `/api/adoption-applications/{id}/under-review` | Poner en revisión (Admin) |
| PATCH | `/api/adoption-applications/{id}/cancel` | Cancelar solicitud |
| PUT | `/api/adoption-applications/{id}` | Actualizar solicitud |
| DELETE | `/api/adoption-applications/{id}` | Eliminar solicitud (Admin) |
| GET | `/api/adoption-applications/stats` | Estadísticas |

## 🔍 Ejemplos de Uso

### Crear Solicitud de Adopción

```json
POST /api/adoption-applications
{
  "catId": "CAT1729990123456",
  "fullName": "Juan Pérez",
  "email": "juan@email.com",
  "phone": "987654321",
  "whyAdopt": "Quiero adoptar porque...",
  "hasVetResources": true,
  "acceptsTerms": true,
  // ... más campos del formulario
}
```

### Buscar Gatos con Filtros

```
GET /api/cats/filter?gender=FEMALE&size=MEDIUM&isVaccinated=true&page=0&size=10
```

### Obtener Gatos Disponibles

```json
GET /api/cats/available

Respuesta:
[
  {
    "id": "CAT1729990123456",
    "name": "Luna",
    "age": "2 años",
    "breed": "Mestizo",
    "mainImage": "/assets/gatos/luna.jpg",
    "gallery": ["/assets/gatos/luna1.jpg", "/assets/gatos/luna2.jpg"],
    "personality": ["Cariñosa", "Juguetona"],
    "description": "Luna es una gatita muy dulce...",
    "isSpecialNeeds": false,
    "vaccinated": true,
    "sterilized": true,
    "gender": "female"
  }
]
```

## ⚙️ Configuración CORS

El backend está configurado para permitir peticiones desde el frontend Angular:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4200", "http://127.0.0.1:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## 🚀 Ejecutar el Proyecto

1. **Asegurar que MySQL esté ejecutándose**
2. **Verificar la configuración del archivo .env**
3. **Ejecutar el backend:**

```bash
cd backend
.\mvnw.cmd spring-boot:run
```

El servidor se ejecutará en `http://localhost:8080`

## 📝 Estados y Enums

### Estados de Adopción del Gato
- `AVAILABLE` - Disponible
- `PENDING` - Pendiente
- `ADOPTED` - Adoptado
- `UNAVAILABLE` - No disponible

### Estados de Solicitud de Adopción
- `PENDING` - Pendiente
- `UNDER_REVIEW` - En revisión
- `APPROVED` - Aprobada
- `REJECTED` - Rechazada
- `CANCELLED` - Cancelada

### Otros Enums
- **Gender**: `MALE`, `FEMALE`, `UNKNOWN`
- **Size**: `SMALL`, `MEDIUM`, `LARGE`
- **ActivityLevel**: `LOW`, `MEDIUM`, `HIGH`
- **HealthStatus**: `HEALTHY`, `SPECIAL_NEEDS`, `RECOVERING`, `CRITICAL`

## 🛡️ Manejo de Errores

El backend incluye un manejador global de excepciones que proporciona respuestas consistentes:

```json
{
  "status": 400,
  "error": "Error de validación",
  "message": "El email debe tener un formato válido",
  "timestamp": "2024-10-26T10:30:00"
}
```

## 📋 Notas Importantes

1. **Base de Datos**: Utiliza `ddl-auto=update` para crear/actualizar automáticamente las tablas
2. **IDs de Gatos**: Se utilizan IDs alfanuméricos (ej: CAT1729990123456)
3. **Validaciones**: Implementadas tanto en el backend como en los DTOs
4. **Paginación**: Disponible en la mayoría de endpoints de listado
5. **CORS**: Configurado para desarrollo local con Angular

¡El backend está completo y listo para funcionar con el frontend Angular! 🎉