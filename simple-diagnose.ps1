# Diagnóstico del error de conexión

Write-Host "Iniciando diagnóstico..." -ForegroundColor Yellow

# 1. Verificar backend
Write-Host "`nVerificando Backend..." -ForegroundColor Cyan
try {
    $connection = Test-NetConnection -ComputerName localhost -Port 8080 -WarningAction SilentlyContinue
    if ($connection.TcpTestSucceeded) {
        Write-Host "Backend corriendo en puerto 8080" -ForegroundColor Green
    } else {
        Write-Host "Backend NO corriendo" -ForegroundColor Red
    }
} catch {
    Write-Host "Error verificando backend" -ForegroundColor Red
}

# 2. Probar health check
Write-Host "`nProbando health check..." -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8080/actuator/health" -Method GET -TimeoutSec 5
    Write-Host "Health check OK: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "Health check fallo: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Probar endpoint test
Write-Host "`nProbando endpoint test..." -ForegroundColor Cyan
try {
    $test = Invoke-RestMethod -Uri "http://localhost:8080/api/adoption-profiles/test" -Method GET -TimeoutSec 5
    Write-Host "Endpoint test OK: $($test.message)" -ForegroundColor Green
} catch {
    Write-Host "Endpoint test fallo: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Verificar frontend
Write-Host "`nVerificando Frontend..." -ForegroundColor Cyan
try {
    $frontend = Test-NetConnection -ComputerName localhost -Port 4200 -WarningAction SilentlyContinue
    if ($frontend.TcpTestSucceeded) {
        Write-Host "Frontend corriendo en puerto 4200" -ForegroundColor Green
    } else {
        Write-Host "Frontend NO corriendo" -ForegroundColor Red
    }
} catch {
    Write-Host "Error verificando frontend" -ForegroundColor Red
}

# 5. Probar POST datos
Write-Host "`nProbando envío de datos..." -ForegroundColor Cyan

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
}

$jsonData = $testData | ConvertTo-Json

try {
    $post = Invoke-RestMethod -Uri "http://localhost:8080/api/adoption-profiles" -Method POST -Body $jsonData -ContentType "application/json" -TimeoutSec 10
    Write-Host "POST exitoso" -ForegroundColor Green
    Write-Host "Respuesta: $($post | ConvertTo-Json)" -ForegroundColor White
} catch {
    Write-Host "POST fallo: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $status = $_.Exception.Response.StatusCode
        Write-Host "Status Code: $status" -ForegroundColor Yellow
    }
}

Write-Host "`nDiagnóstico completado" -ForegroundColor Green