-- V1__init.sql

CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    google_id VARCHAR(255),
    nombre_completo VARCHAR(255) NOT NULL,
    telefono VARCHAR(255) NOT NULL,
    direccion TEXT,
    ciudad VARCHAR(255),
    tipo_vivienda TEXT,
    experiencia_previas TEXT,
    tiene_mas_mascotas BOOLEAN DEFAULT FALSE,
    perfil_completo BOOLEAN DEFAULT FALSE,
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE cats (
    id CHAR(36) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    sexo ENUM('MACHO', 'HEMBRA'),
    edad_meses INT,
    tamano ENUM('PEQUENO', 'MEDIANO', 'GRANDE'),
    vacunas BOOLEAN DEFAULT FALSE,
    esterilizado BOOLEAN DEFAULT FALSE,
    descripcion TEXT,
    estado ENUM('DISPONIBLE', 'PENDIENTE', 'ADOPTADO', 'NO_DISPONIBLE'),
    ingreso_at TIMESTAMP,
    current_owner_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (current_owner_id) REFERENCES users(id)
);

CREATE TABLE cat_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cat_id CHAR(36) NOT NULL,
    url VARCHAR(500) NOT NULL,
    orden INT DEFAULT 0,
    FOREIGN KEY (cat_id) REFERENCES cats(id) ON DELETE CASCADE
);

CREATE TABLE applications (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    cat_id CHAR(36) NOT NULL,
    mensaje TEXT,
    estado ENUM('PENDIENTE', 'ACEPTADO', 'RECHAZADO') DEFAULT 'PENDIENTE',
    respuesta_admin TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (cat_id) REFERENCES cats(id)
);

CREATE TABLE application_forms (
    id CHAR(36) PRIMARY KEY,
    application_id CHAR(36) UNIQUE NOT NULL,
    nombre_completo TEXT,
    telefono TEXT,
    direccion TEXT,
    ciudad TEXT,
    tipo_vivienda TEXT,
    experiencia_previas TEXT,
    tiene_mas_mascotas BOOLEAN DEFAULT FALSE,
    detalles_mascotas_actuales TEXT,
    tiene_hijos BOOLEAN DEFAULT FALSE,
    edades_hijos TEXT,
    tamano_hogar TEXT,
    todos_acuerdan BOOLEAN DEFAULT FALSE,
    tiene_alergias BOOLEAN DEFAULT FALSE,
    planes_mudanza TEXT,
    tiene_espacio BOOLEAN DEFAULT FALSE,
    areas_acceso TEXT,
    lugar_dormir TEXT,
    tiene_espacios_escape BOOLEAN DEFAULT FALSE,
    respuesta_problemas_comportamiento TEXT,
    quien_paga_gastos TEXT,
    tiene_recursos_veterinarios BOOLEAN DEFAULT FALSE,
    compromisos_cuidado TEXT,
    compromiso_esterilizar BOOLEAN DEFAULT FALSE,
    acepta_visitas BOOLEAN DEFAULT FALSE,
    acepta_terminos BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

CREATE TABLE adoptions (
    id CHAR(36) PRIMARY KEY,
    application_id CHAR(36),
    cat_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    adoption_date DATE NOT NULL,
    status ENUM('ACTIVE', 'RETURNED') DEFAULT 'ACTIVE',
    return_date DATE,
    notes TEXT,
    FOREIGN KEY (application_id) REFERENCES applications(id),
    FOREIGN KEY (cat_id) REFERENCES cats(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE donations (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    provider ENUM('PAYPAL', 'YAPE'),
    provider_reference VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'PEN',
    status ENUM('PENDING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);