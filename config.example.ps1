# Archivo de ejemplo de configuración para AdoptaCat FullStack
# Copie este archivo como config.local.ps1 y configure sus valores

# Configuración de Base de Datos MySQL
$env:MYSQL_HOST = "localhost"
$env:MYSQL_PORT = "3306"
$env:MYSQL_DATABASE = "adoptacat_db"
$env:MYSQL_USER = "root"
$env:MYSQL_PASSWORD = "SU_CONTRASEÑA_MYSQL_AQUI"

# Puertos de la aplicación
$env:BACKEND_PORT = "8080"
$env:FRONTEND_PORT = "4200"

Write-Host "✅ Configuración cargada correctamente" -ForegroundColor Green