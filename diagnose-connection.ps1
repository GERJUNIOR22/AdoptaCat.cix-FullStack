# 🔧 Script de Diagnóstico - Error de Conexión Formulario

Write-Host "🔍 Iniciando diagnóstico del error de conexión..." -ForegroundColor Yellow

## 1. Verificar Backend
Write-Host "`n1️⃣ Verificando Backend..." -ForegroundColor Cyan

# Verificar si el puerto 8080 está en uso
$backendProcess = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($backendProcess) {
    Write-Host "✅ Backend corriendo en puerto 8080" -ForegroundColor Green
} else {
    Write-Host "❌ Backend NO está corriendo en puerto 8080" -ForegroundColor Red
    Write-Host "💡 Inicia el backend con: cd backend && .\mvnw.cmd spring-boot:run" -ForegroundColor Yellow
    exit 1
}

## 2. Probar conectividad básica
Write-Host "`n2️⃣ Probando conectividad básica..." -ForegroundColor Cyan

try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:8080/actuator/health" -Method GET -TimeoutSec 5
    Write-Host "✅ Health check exitoso: $($healthResponse.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health check falló: $($_.Exception.Message)" -ForegroundColor Red
}

## 3. Probar endpoint de adopción
Write-Host "`n3️⃣ Probando endpoint de adopción..." -ForegroundColor Cyan

try {
    $testResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/adoption-profiles/test" -Method GET -TimeoutSec 5
    Write-Host "✅ Endpoint de adopción accesible: $($testResponse.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Endpoint de adopción falló: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Revisar logs del backend para más detalles" -ForegroundColor Yellow
}

## 4. Verificar Frontend
Write-Host "`n4️⃣ Verificando Frontend..." -ForegroundColor Cyan

$frontendProcess = Get-NetTCPConnection -LocalPort 4200 -ErrorAction SilentlyContinue
if ($frontendProcess) {
    Write-Host "✅ Frontend corriendo en puerto 4200" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend NO está corriendo en puerto 4200" -ForegroundColor Red
    Write-Host "💡 Inicia el frontend con: cd frontend && npm start" -ForegroundColor Yellow
}

## 5. Probar envío de datos
Write-Host "`n5️⃣ Probando envío de datos simulado..." -ForegroundColor Cyan

$testData = @{
    nombreCompleto = "Test Usuario"
    correoElectronico = "test@example.com"
    celular = "987654321"
    dni = "12345678"
    estadoCivil = "Soltero"
    direccion = "Test Address"
    distrito = "Test District"
    porqueAdoptar = "Test reason"
    cuantasPersonasCasa = 2
    todosAcuerdan = $true
    aceptoCondiciones = $true
} | ConvertTo-Json

try {
    $testPost = Invoke-RestMethod -Uri "http://localhost:8080/api/adoption-profiles" -Method POST -Body $testData -ContentType "application/json" -TimeoutSec 10
    Write-Host "✅ Envío de datos simulado exitoso: $($testPost.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Envío de datos falló: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode
        Write-Host "📊 Status Code: $statusCode" -ForegroundColor Yellow
        
        if ($statusCode -eq 400) {
            Write-Host "💡 Error 400: Problema con validación de datos" -ForegroundColor Yellow
        } elseif ($statusCode -eq 500) {
            Write-Host "💡 Error 500: Problema interno del servidor" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n🎯 Diagnóstico completado" -ForegroundColor Green
Write-Host "💡 Si hay errores, revisar:" -ForegroundColor Yellow
Write-Host "   - Logs del backend (consola donde corre Spring Boot)" -ForegroundColor White
Write-Host "   - DevTools del navegador (F12 → Console → Network)" -ForegroundColor White
Write-Host "   - Variables de entorno de MySQL" -ForegroundColor White