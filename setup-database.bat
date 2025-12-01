@echo off
echo === Configuracion de AdoptaCat ===

REM Crear archivo .env si no existe
if not exist .env (
    echo Creando archivo .env...
    (
        echo # Configuracion del servidor
        echo SERVER_PORT=8080
        echo.
        echo # Configuracion de la base de datos MySQL
        echo DB_HOST=localhost
        echo DB_PORT=3306
        echo DB_NAME=adoptacat_db
        echo DB_USER=root
        echo DB_PASS=
        echo.
        echo # Configuracion OAuth2 con Google
        echo GOOGLE_CLIENT_ID=your_google_client_id
        echo GOOGLE_CLIENT_SECRET=your_google_client_secret
        echo GOOGLE_REDIRECT_URI=http://localhost:8080/login/oauth2/code/google
        echo.
        echo # Perfil de Spring
        echo SPRING_PROFILES_ACTIVE=dev
    ) > .env
    echo ✅ Archivo .env creado
)

echo.
echo === Instrucciones de configuracion ===
echo.
echo 1. 📊 CONFIGURAR BASE DE DATOS:
echo    - Instala MySQL y crea la base de datos:
echo      mysql -u root -p ^< backend\database\adoptacat_database.sql
echo.
echo 2. 🔧 CONFIGURAR VARIABLES DE ENTORNO:
echo    - Edita el archivo .env con tus credenciales de base de datos
echo    - Actualiza DB_PASS con tu contraseña de MySQL
echo.
echo 3. 🚀 EJECUTAR APLICACION:
echo    - Backend: cd backend ^&^& mvn spring-boot:run
echo    - Frontend: cd frontend ^&^& npm install ^&^& npm start
echo.
echo 4. 🌐 ACCEDER A LA APLICACION:
echo    - Frontend: http://localhost:4200
echo    - Backend API: http://localhost:8080/api
echo.
echo 5. 📝 PROBAR PERFIL DE ADOPCION:
echo    - Ve a http://localhost:4200/profile
echo    - Llena el formulario y envia
echo    - Los datos se guardaran en la tabla adoption_profiles
echo.
echo === Funcionalidades implementadas ===
echo ✅ Modelo de base de datos para perfiles de adopcion
echo ✅ Repository, Service y Controller en Spring Boot
echo ✅ API REST completa ^(/api/adoption-profiles^)
echo ✅ Servicio Angular para consumir la API
echo ✅ Formulario conectado a la base de datos
echo ✅ Validaciones en frontend y backend
echo ✅ Manejo de errores y respuestas
echo.
pause