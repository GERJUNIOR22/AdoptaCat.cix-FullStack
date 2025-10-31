#!/bin/bash

# Script de configuración rápida para AdoptaCat
echo "=== Configuración de AdoptaCat ==="

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "Creando archivo .env..."
    cat > .env << EOL
# Configuración del servidor
SERVER_PORT=8080

# Configuración de la base de datos MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=adoptacat_db
DB_USER=root
DB_PASS=

# Configuración OAuth2 con Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8080/login/oauth2/code/google

# Perfil de Spring
SPRING_PROFILES_ACTIVE=dev
EOL
    echo "✅ Archivo .env creado"
fi

echo ""
echo "=== Instrucciones de configuración ==="
echo ""
echo "1. 📊 CONFIGURAR BASE DE DATOS:"
echo "   - Instala MySQL y crea la base de datos:"
echo "     mysql -u root -p < backend/database/adoptacat_database.sql"
echo ""
echo "2. 🔧 CONFIGURAR VARIABLES DE ENTORNO:"
echo "   - Edita el archivo .env con tus credenciales de base de datos"
echo "   - Actualiza DB_PASS con tu contraseña de MySQL"
echo ""
echo "3. 🚀 EJECUTAR APLICACIÓN:"
echo "   - Backend: cd backend && mvn spring-boot:run"
echo "   - Frontend: cd frontend && npm install && npm start"
echo ""
echo "4. 🌐 ACCEDER A LA APLICACIÓN:"
echo "   - Frontend: http://localhost:4200"
echo "   - Backend API: http://localhost:8080/api"
echo ""
echo "5. 📝 PROBAR PERFIL DE ADOPCIÓN:"
echo "   - Ve a http://localhost:4200/profile"
echo "   - Llena el formulario y envía"
echo "   - Los datos se guardarán en la tabla adoption_profiles"
echo ""
echo "=== Funcionalidades implementadas ==="
echo "✅ Modelo de base de datos para perfiles de adopción"
echo "✅ Repository, Service y Controller en Spring Boot"
echo "✅ API REST completa (/api/adoption-profiles)"
echo "✅ Servicio Angular para consumir la API"
echo "✅ Formulario conectado a la base de datos"
echo "✅ Validaciones en frontend y backend"
echo "✅ Manejo de errores y respuestas"
echo ""