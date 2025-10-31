# 🔒 Configuración de Seguridad - AdoptaCat

## ⚠️ ACCIÓN INMEDIATA REQUERIDA

La contraseña de MySQL estaba expuesta en el código. **Debe cambiarla inmediatamente**.

## 📋 Pasos para Configuración Segura

### 1. Cambiar Contraseña de MySQL

```sql
-- Conectarse a MySQL como root
mysql -u root -p

-- Cambiar contraseña (reemplazar con una segura)
ALTER USER 'root'@'localhost' IDENTIFIED BY 'TU_NUEVA_CONTRASEÑA_SEGURA_123!';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Configurar Variables de Entorno

```powershell
# Opción A: Copiar archivo de ejemplo
Copy-Item 'config.example.ps1' 'config.local.ps1'

# Editar config.local.ps1 con sus credenciales reales
notepad config.local.ps1
```

```powershell
# Opción B: Variables de entorno del sistema
$env:MYSQL_PASSWORD = "TU_NUEVA_CONTRASEÑA_SEGURA_123!"
```

### 3. Configurar Backend (application.properties)

```properties
# backend/src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/adoptacat_db
spring.datasource.username=root
spring.datasource.password=${MYSQL_PASSWORD:default_dev_password}
```

### 4. Ejecutar la Aplicación

```powershell
# Ahora puede ejecutar de forma segura
.\start-fullstack-fixed.ps1
```

## 🛡️ Mejores Prácticas de Seguridad

### ✅ SÍ hacer:
- Usar variables de entorno para credenciales
- Mantener `config.local.ps1` fuera del control de versiones
- Usar contraseñas fuertes (12+ caracteres, números, símbolos)
- Rotar credenciales regularmente
- Usar principio de menor privilegio

### ❌ NO hacer:
- Hardcodear contraseñas en el código
- Compartir credenciales en mensajes/emails
- Usar contraseñas simples
- Incluir archivos de configuración en Git
- Reutilizar contraseñas entre sistemas

## 🔐 Ejemplos de Contraseñas Seguras

```
AdoptaCat2025!@Security
MySecure_Database_Pass_123!
Cats&Dogs_Are_Awesome_456#
```

## 📁 Archivos Excluidos del Control de Versiones

```
config.local.ps1          # Configuración local
change-mysql-password.sql # Script de cambio de contraseña
*.credentials             # Archivos de credenciales
.env.local                # Variables de entorno locales
```

## 🚨 En caso de Compromiso

Si sospecha que las credenciales fueron comprometidas:

1. **Cambiar contraseñas inmediatamente**
2. **Revisar logs de acceso**
3. **Verificar conexiones activas**
4. **Actualizar todas las aplicaciones**
5. **Notificar al equipo**

## 📞 Contacto

Para dudas de seguridad, contactar al administrador del sistema.

---
*Configuración actualizada: 30 de octubre de 2025*