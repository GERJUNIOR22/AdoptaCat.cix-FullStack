# 🐱 AdoptaCat Database Setup

Este documento contiene toda la información necesaria para configurar la base de datos del sistema AdoptaCat.

## 📋 Requisitos Previos

- MySQL 8.0 o superior
- Java 17 o superior
- Maven 3.6 o superior

## 🗄️ Configuración de la Base de Datos

### 1. Instalación de MySQL

**Windows:**
```bash
# Descargar MySQL desde https://dev.mysql.com/downloads/mysql/
# Instalar siguiendo el wizard
```

**macOS (con Homebrew):**
```bash
brew install mysql
brew services start mysql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 2. Configuración Inicial de MySQL

```sql
-- Conectar como root
mysql -u root -p

-- Crear la base de datos
CREATE DATABASE adoptacat_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear usuario específico para AdoptaCat
CREATE USER 'adoptacat_user'@'localhost' IDENTIFIED BY 'adoptacat_password';

-- Otorgar permisos
GRANT ALL PRIVILEGES ON adoptacat_db.* TO 'adoptacat_user'@'localhost';
FLUSH PRIVILEGES;

-- Verificar la conexión
USE adoptacat_db;
SHOW TABLES;
```

### 3. Ejecutar el Script de la Base de Datos

```bash
# Desde el directorio backend/database/
mysql -u adoptacat_user -p adoptacat_db < adoptacat_database.sql
```

## 🏗️ Estructura de la Base de Datos

### Entidades Principales

#### 👤 **Users** - Usuarios del Sistema
- Administradores y usuarios regulares
- Autenticación por email y contraseña
- Roles: USER, ADMIN

#### 🐱 **Cats** - Catálogo de Gatos
- Información completa de cada gato
- Estados de adopción: AVAILABLE, PENDING, ADOPTED, UNAVAILABLE
- Características físicas y de personalidad

#### 🖼️ **Cat Images** - Galería de Imágenes
- Múltiples imágenes por gato
- Imagen principal y galería secundaria
- Orden de visualización

#### 📋 **Adoption Applications** - Solicitudes de Adopción
- Formulario completo de adopción
- Estados: PENDING, UNDER_REVIEW, APPROVED, REJECTED, CANCELLED
- Toda la información del candidato

#### ✅ **Adoptions** - Adopciones Completadas
- Registro de adopciones exitosas
- Contratos y documentación
- Seguimiento post-adopción

#### 🏠 **Follow Up Visits** - Visitas de Seguimiento
- Monitoreo post-adopción
- Estado del gato y satisfacción del adoptante
- Programación de visitas futuras

#### 💰 **Donations** - Sistema de Donaciones
- Donaciones monetarias y en especie
- Métodos: Yape, Plin, transferencias
- Propósitos específicos o generales

#### 🏥 **Veterinary Expenses** - Gastos Veterinarios
- Control de gastos médicos por gato
- Tipos de tratamiento y costos
- Comprobantes y documentación

#### 📝 **Blog Posts** - Sistema de Blog
- Contenido educativo y noticias
- Categorías: historias de adopción, cuidados, eventos
- Sistema de publicación

### Relaciones Principales

```
Users (1) -----> (N) AdoptionApplications (reviewedBy)
Users (1) -----> (N) BlogPosts (author)

Cats (1) -----> (N) CatImages
Cats (1) -----> (N) AdoptionApplications
Cats (1) -----> (N) VeterinaryExpenses
Cats (1) -----> (N) Adoptions

AdoptionApplications (1) -----> (1) Adoptions
Adoptions (1) -----> (N) FollowUpVisits

Cats (1) -----> (N) Donations (specificCat - opcional)
```

## ⚙️ Configuración del Backend

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto backend:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=adoptacat_db
DB_USER=adoptacat_user
DB_PASS=adoptacat_password

# Server Configuration
SERVER_PORT=8080

# Security
JWT_SECRET=YWRvcHRhY2F0LXNlY3JldC1rZXktZm9yLWp3dC10b2tlbnMtYWRvcHRhY2F0LWNoaWNsYXlv
JWT_EXPIRATION=86400000

# Email Configuration
EMAIL_USERNAME=tu-email@gmail.com
EMAIL_PASSWORD=tu-password-app

# Spring Profile
SPRING_PROFILES_ACTIVE=dev
```

### Configuración para Desarrollo Local

```properties
# application-dev.properties
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
logging.level.com.adoptacat=DEBUG
```

### Configuración para Producción

```properties
# application-prod.properties
spring.jpa.show-sql=false
spring.jpa.hibernate.ddl-auto=validate
logging.level.com.adoptacat=INFO
```

## 🚀 Ejecutar la Aplicación

### 1. Compilar el Proyecto

```bash
cd backend
mvn clean compile
```

### 2. Ejecutar Tests

```bash
mvn test
```

### 3. Iniciar la Aplicación

```bash
mvn spring-boot:run
```

O con perfil específico:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

## 📊 Datos Iniciales

El script SQL incluye datos de ejemplo:

### Usuarios Administradores
- admin@adoptacat.org
- gerencia@adoptacat.org  
- director@adoptacat.org

**Contraseña por defecto:** `admin123` (cambiar en producción)

### Gatos de Ejemplo
- Luna (Doméstico Pelo Corto)
- Oliver (Atigrado)
- Milo (Siamés Mestizo)

### Configuración del Sistema
- Información de contacto
- Números para donaciones (Yape/Plin)
- Configuraciones por defecto

## 🔧 Mantenimiento

### Backup de la Base de Datos

```bash
# Crear backup
mysqldump -u adoptacat_user -p adoptacat_db > backup_adoptacat_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
mysql -u adoptacat_user -p adoptacat_db < backup_adoptacat_YYYYMMDD_HHMMSS.sql
```

### Monitoreo de Performance

```sql
-- Ver consultas lentas
SHOW PROCESSLIST;

-- Estadísticas de tablas
SELECT 
    table_name,
    table_rows,
    data_length,
    index_length
FROM information_schema.tables 
WHERE table_schema = 'adoptacat_db';
```

### Optimización de Índices

```sql
-- Analizar uso de índices
SHOW INDEX FROM cats;
SHOW INDEX FROM adoption_applications;

-- Estadísticas de uso
SELECT * FROM sys.schema_index_statistics 
WHERE object_schema = 'adoptacat_db';
```

## 📝 Migraciones

Para cambios futuros en la estructura de la base de datos, usar Flyway:

```xml
<!-- Agregar al pom.xml -->
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

Crear archivos de migración en `src/main/resources/db/migration/`:
- `V1__Initial_schema.sql`
- `V2__Add_new_table.sql`
- etc.

## 🛠️ Troubleshooting

### Error de Conexión a MySQL

```bash
# Verificar que MySQL esté ejecutándose
sudo systemctl status mysql

# Verificar puerto
netstat -tlnp | grep :3306

# Verificar usuario y permisos
mysql -u adoptacat_user -p
```

### Error de Encoding

```sql
-- Verificar charset de la base de datos
SELECT default_character_set_name, default_collation_name 
FROM information_schema.schemata 
WHERE schema_name = 'adoptacat_db';

-- Cambiar si es necesario
ALTER DATABASE adoptacat_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Error de Foreign Keys

```sql
-- Deshabilitar temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Hacer cambios necesarios

-- Rehabilitar
SET FOREIGN_KEY_CHECKS = 1;
```

## 📚 Referencias

- [Spring Boot Data JPA](https://spring.io/projects/spring-data-jpa)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Hibernate Documentation](https://hibernate.org/orm/documentation/)

---

¡La base de datos de AdoptaCat está lista para ayudar a encontrar hogares para nuestros felinos! 🐱💕