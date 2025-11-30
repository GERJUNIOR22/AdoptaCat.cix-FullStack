#!/bin/bash

echo "🚀 Iniciando AdoptaCat FullStack..."

# Función para verificar si un puerto está en uso
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Verificar dependencias del frontend
echo "📦 Verificando dependencias del frontend..."
cd frontend

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias de npm..."
    npm install
fi

# Verificar dependencias del backend
echo "📦 Verificando dependencias del backend..."
cd ../backend

# Compilar el proyecto
echo "🔨 Compilando proyecto backend..."
./mvnw clean compile

# Verificar que MySQL esté corriendo
echo "🗄️ Verificando conexión a MySQL..."
if ! mysql -u root -p"junior22Ger+" -e "SELECT 1;" 2>/dev/null; then
    echo "⚠️ MySQL no está accesible. Asegúrate de que esté corriendo."
    echo "Intentando crear la base de datos..."
    mysql -u root -p"junior22Ger+" -e "CREATE DATABASE IF NOT EXISTS adoptacat_db;"
fi

# Iniciar backend en segundo plano
echo "🌐 Iniciando backend en puerto 8080..."
if check_port 8080; then
    echo "⚠️ El puerto 8080 ya está en uso. Parando proceso anterior..."
    pkill -f "spring-boot:run"
    sleep 2
fi

./mvnw spring-boot:run &
BACKEND_PID=$!

# Esperar a que el backend esté listo
echo "⏳ Esperando que el backend esté listo..."
for i in {1..30}; do
    if curl -f http://localhost:8080/actuator/health >/dev/null 2>&1; then
        echo "✅ Backend está corriendo correctamente"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Backend no pudo iniciarse correctamente"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
    sleep 2
done

# Iniciar frontend
echo "🎨 Iniciando frontend en puerto 4200..."
cd ../frontend

if check_port 4200; then
    echo "⚠️ El puerto 4200 ya está en uso. Parando proceso anterior..."
    pkill -f "ng serve"
    sleep 2
fi

ng serve --open &
FRONTEND_PID=$!

echo ""
echo "🎉 AdoptaCat FullStack está corriendo!"
echo "🌐 Frontend: http://localhost:4200"
echo "🔧 Backend: http://localhost:8080"
echo "📊 Health Check: http://localhost:8080/actuator/health"
echo ""
echo "Para detener los servicios, presiona Ctrl+C"

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "🛑 Deteniendo servicios..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    pkill -f "spring-boot:run" 2>/dev/null
    pkill -f "ng serve" 2>/dev/null
    echo "✅ Servicios detenidos"
    exit 0
}

# Capturar Ctrl+C para limpiar procesos
trap cleanup SIGINT SIGTERM

# Mantener el script corriendo
wait