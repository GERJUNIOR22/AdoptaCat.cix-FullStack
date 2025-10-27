#!/bin/bash

echo "🚀 Iniciando AdoptaCat FullStack"
echo "================================="

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi

# Verificar si Java está instalado
if ! command -v java &> /dev/null; then
    echo "❌ Java no está instalado"
    exit 1
fi

# Verificar si MySQL está ejecutándose
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL no está instalado o no está en el PATH"
    echo "   Asegúrate de tener MySQL ejecutándose en localhost:3306"
fi

echo "✅ Dependencias verificadas"

# Iniciar backend en segundo plano
echo "🔧 Iniciando backend Spring Boot..."
cd backend
if [ -f ".env" ]; then
    echo "✅ Archivo .env encontrado"
else
    echo "⚠️  Archivo .env no encontrado. Copiando desde .env.example"
    cp .env.example .env
    echo "📝 Edita el archivo .env con tu configuración de base de datos"
fi

# Compilar y ejecutar backend
./mvnw clean package -DskipTests
./mvnw spring-boot:run &
BACKEND_PID=$!

echo "⏳ Esperando que el backend se inicie..."
sleep 30

# Verificar si el backend está ejecutándose
if curl -f http://localhost:8080/api/cats/available > /dev/null 2>&1; then
    echo "✅ Backend iniciado correctamente en http://localhost:8080"
else
    echo "❌ Backend no responde. Verifica la configuración de la base de datos."
fi

# Iniciar frontend
echo "🎨 Iniciando frontend Angular..."
cd ../frontend
npm install
npm start &
FRONTEND_PID=$!

echo "⏳ Esperando que el frontend se inicie..."
sleep 15

echo "🎉 AdoptaCat FullStack iniciado!"
echo "📱 Frontend: http://localhost:4200"
echo "🔧 Backend API: http://localhost:8080"
echo "📊 API Docs: http://localhost:8080/api/cats/available"

echo ""
echo "Para detener los servicios:"
echo "kill $BACKEND_PID $FRONTEND_PID"

# Mantener el script ejecutándose
wait