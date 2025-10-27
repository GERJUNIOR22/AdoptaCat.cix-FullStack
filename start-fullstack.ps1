# Script para iniciar AdoptaCat FullStack en Windows
Write-Host "🚀 Iniciando AdoptaCat FullStack" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Verificar dependencias
Write-Host "🔍 Verificando dependencias..."

if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js no está instalado" -ForegroundColor Red
    exit 1
}

if (!(Get-Command java -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Java no está instalado" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencias verificadas" -ForegroundColor Green

# Configurar variables de entorno para el backend
$env:SERVER_PORT = "8080"
$env:DB_HOST = "localhost"
$env:DB_PORT = "3306"
$env:DB_NAME = "adoptacat_db"
$env:DB_USER = "adoptacat_user"
$env:DB_PASS = "adoptacat_password"
$env:SPRING_PROFILES_ACTIVE = "dev"

# Iniciar backend
Write-Host "🔧 Iniciando backend Spring Boot..." -ForegroundColor Blue
Set-Location backend

# Verificar si existe .env
if (!(Test-Path ".env")) {
    Write-Host "⚠️  Archivo .env no encontrado. Copiando desde .env.example" -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "📝 Edita el archivo .env con tu configuración de base de datos" -ForegroundColor Yellow
}

# Iniciar backend en segundo plano
Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "mvnw.cmd spring-boot:run" -WindowStyle Minimized

Write-Host "⏳ Esperando que el backend se inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Verificar backend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/cats/available" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend iniciado correctamente en http://localhost:8080" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend no responde. Verifica la configuración de la base de datos." -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Iniciar frontend
Write-Host "🎨 Iniciando frontend Angular..." -ForegroundColor Blue
Set-Location ../frontend

# Instalar dependencias si no existen
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias del frontend..." -ForegroundColor Yellow
    npm install
}

# Iniciar frontend
Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npm start" -WindowStyle Normal

Write-Host "🎉 AdoptaCat FullStack iniciado!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:4200" -ForegroundColor Cyan
Write-Host "🔧 Backend API: http://localhost:8080" -ForegroundColor Cyan
Write-Host "📊 API Test: http://localhost:8080/api/cats/available" -ForegroundColor Cyan

Write-Host ""
Write-Host "⚠️  Para detener los servicios, cierra las ventanas de terminal que se abrieron" -ForegroundColor Yellow
Write-Host "   o usa Ctrl+C en las ventanas correspondientes" -ForegroundColor Yellow

# Abrir navegador
Start-Process "http://localhost:4200"

Write-Host ""
Write-Host "Presiona cualquier tecla para salir..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")