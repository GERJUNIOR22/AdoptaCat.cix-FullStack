# 🚀 Configuración Inicial - AdoptaCat FullStack

## 📋 Requisitos Previos

- ✅ Java 17+
- ✅ Node.js 18+
- ✅ MySQL 8.0+
- ✅ Maven 3.6+

## 🔧 Configuración Paso a Paso

### 1. Clonar el Repositorio

```bash
git clone https://github.com/GERJUNIOR22/AdoptaCat.cix-FullStack.git
cd AdoptaCat.cix-FullStack
```

### 2. Configurar Base de Datos

```sql
-- Crear base de datos
CREATE DATABASE adoptacat_db;

-- Crear usuario (opcional, recomendado para producción)
CREATE USER 'adoptacat_user'@'localhost' IDENTIFIED BY 'TU_CONTRASEÑA_SEGURA';
GRANT ALL PRIVILEGES ON adoptacat_db.* TO 'adoptacat_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configurar Variables de Entorno

```powershell
# Copiar archivo de configuración de ejemplo
Copy-Item 'config.example.ps1' 'config.local.ps1'

# Editar con sus credenciales reales
notepad config.local.ps1
```

### 4. Configurar Backend

```properties
# backend/src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/adoptacat_db
spring.datasource.username=root
spring.datasource.password=${MYSQL_PASSWORD}
spring.jpa.hibernate.ddl-auto=update
```

### 5. Instalar Dependencias

```bash
# Frontend
cd frontend
npm install

# Backend (automático con Maven Wrapper)
cd ../backend
./mvnw clean install
```

### 6. Ejecutar la Aplicación

```powershell
# Ejecutar script de inicio
.\start-fullstack-fixed.ps1
```

## 🌐 URLs de la Aplicación

- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:8080
- **Health Check:** http://localhost:8080/actuator/health
- **Swagger UI:** http://localhost:8080/swagger-ui.html

## 🛠️ Scripts Disponibles

```powershell
# Inicio completo (recomendado)
.\start-fullstack-fixed.ps1

# Solo backend
cd backend && .\mvnw.cmd spring-boot:run

# Solo frontend
cd frontend && npm start
```

## 🔍 Verificación

1. **Base de datos:** Conexión exitosa a MySQL
2. **Backend:** http://localhost:8080/actuator/health → Status: UP
3. **Frontend:** http://localhost:4200 → Página principal visible
4. **API:** http://localhost:8080/api/cats → Lista de gatos

## ❗ Solución de Problemas

### Error de Conexión a MySQL
```powershell
# Verificar servicio MySQL
Get-Service -Name "*mysql*"

# Iniciar servicio si está detenido
Start-Service -Name "MySQL80"
```

### Error de Puerto en Uso
```powershell
# El script automáticamente detiene procesos en puertos 4200 y 8080
# Si persiste el error, reiniciar manualmente:
netstat -ano | findstr :8080
taskkill /F /PID [PID_ENCONTRADO]
```

### Error de Permisos
```powershell
# Ejecutar PowerShell como Administrador
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 📝 Notas Importantes

- ⚠️ **Nunca incluir credenciales en el código**
- 🔒 **Usar contraseñas seguras**
- 📁 **Los archivos `config.local.ps1` están excluidos de Git**
- 🔄 **Cambiar contraseñas regularmente**

---
*Última actualización: 30 de octubre de 2025*