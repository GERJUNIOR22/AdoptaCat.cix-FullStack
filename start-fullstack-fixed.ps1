# Script para iniciar AdoptaCat FullStack en Windows
# Asegúrate de ejecutar como administrador si es necesario

Write-Host "🚀 Iniciando AdoptaCat FullStack..." -ForegroundColor Green

# Función para verificar si un puerto está en uso
function Test-Port {
    param([int]$Port)
    try {
        $connection = Test-NetConnection -ComputerName localhost -Port $Port -InformationLevel Quiet
        return $connection
    } catch {
        return $false
    }
}

# Función para detener procesos en un puerto específico
function Stop-ProcessOnPort {
    param([int]$Port)
    $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
    foreach ($processId in $processes) {
        try {
            Stop-Process -Id $processId -Force
            Write-Host "Proceso detenido en puerto $Port" -ForegroundColor Yellow
        } catch {
            Write-Host "No se pudo detener el proceso $processId" -ForegroundColor Red
        }
    }
}

try {
    # Verificar dependencias del frontend
    Write-Host "📦 Verificando dependencias del frontend..." -ForegroundColor Cyan
    Set-Location -Path "frontend"

    # Instalar dependencias si es necesario
    if (-not (Test-Path "node_modules")) {
        Write-Host "Instalando dependencias de npm..." -ForegroundColor Yellow
        npm install
        if ($LASTEXITCODE -ne 0) {
            throw "Error instalando dependencias de npm"
        }
    }

    # Verificar dependencias del backend
    Write-Host "📦 Verificando dependencias del backend..." -ForegroundColor Cyan
    Set-Location -Path "..\backend"

    # Compilar el proyecto
    Write-Host "🔨 Compilando proyecto backend..." -ForegroundColor Cyan
    .\mvnw.cmd clean compile
    if ($LASTEXITCODE -ne 0) {
        throw "Error compilando el backend"
    }

    # Verificar MySQL
    Write-Host "🗄️ Verificando conexión a MySQL..." -ForegroundColor Cyan
    try {
        mysql -u root -p"junior22Ger+" -e "SELECT 1;" 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "⚠️ Intentando crear la base de datos..." -ForegroundColor Yellow
            mysql -u root -p"junior22Ger+" -e "CREATE DATABASE IF NOT EXISTS adoptacat_db;"
        }
    } catch {
        Write-Host "⚠️ MySQL no está accesible. Verifica que esté corriendo." -ForegroundColor Red
    }

    # Detener procesos en puertos si existen
    if (Test-Port -Port 8080) {
        Write-Host "⚠️ Deteniendo proceso en puerto 8080..." -ForegroundColor Yellow
        Stop-ProcessOnPort -Port 8080
        Start-Sleep -Seconds 2
    }

    if (Test-Port -Port 4200) {
        Write-Host "⚠️ Deteniendo proceso en puerto 4200..." -ForegroundColor Yellow
        Stop-ProcessOnPort -Port 4200
        Start-Sleep -Seconds 2
    }

    # Iniciar backend
    Write-Host "🌐 Iniciando backend en puerto 8080..." -ForegroundColor Green
    $backendJob = Start-Job -ScriptBlock {
        Set-Location -Path $using:PWD
        .\mvnw.cmd spring-boot:run
    }

    # Esperar a que el backend esté listo
    Write-Host "⏳ Esperando que el backend esté listo..." -ForegroundColor Yellow
    $attempts = 0
    do {
        Start-Sleep -Seconds 3
        $attempts++
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -TimeoutSec 5 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                Write-Host "✅ Backend está corriendo correctamente" -ForegroundColor Green
                break
            }
        } catch {
            # Continuar esperando
        }
        
        if ($attempts -ge 20) {
            throw "Backend no pudo iniciarse correctamente después de 60 segundos"
        }
    } while ($true)

    # Iniciar frontend
    Write-Host "🎨 Iniciando frontend en puerto 4200..." -ForegroundColor Green
    Set-Location -Path "..\frontend"
    
    $frontendJob = Start-Job -ScriptBlock {
        Set-Location -Path $using:PWD
        npx ng serve --open
    }

    Write-Host ""
    Write-Host "🎉 AdoptaCat FullStack está corriendo!" -ForegroundColor Green
    Write-Host "🌐 Frontend: http://localhost:4200" -ForegroundColor Cyan
    Write-Host "🔧 Backend: http://localhost:8080" -ForegroundColor Cyan
    Write-Host "📊 Health Check: http://localhost:8080/actuator/health" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Para detener los servicios, presiona Ctrl+C" -ForegroundColor Yellow

    # Esperar entrada del usuario para detener
    Write-Host "Presiona cualquier tecla para detener los servicios..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
} finally {
    # Limpiar trabajos y procesos
    Write-Host ""
    Write-Host "🛑 Deteniendo servicios..." -ForegroundColor Yellow
    
    if ($backendJob) {
        Stop-Job -Job $backendJob -PassThru | Remove-Job
    }
    if ($frontendJob) {
        Stop-Job -Job $frontendJob -PassThru | Remove-Job
    }
    
    Stop-ProcessOnPort -Port 8080
    Stop-ProcessOnPort -Port 4200
    
    Write-Host "✅ Servicios detenidos" -ForegroundColor Green
}