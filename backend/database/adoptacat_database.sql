-- =====================================================
-- ADOPTACAT DATABASE SCHEMA - VERSIÓN LIMPIA
-- Base de datos que coincide EXACTAMENTE con lo que existe en la página
-- =====================================================

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS adoptacat_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE adoptacat_db;

-- =====================================================
-- TABLA: USUARIOS (ADMINISTRADORES Y USUARIOS)
-- =====================================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    profile_image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_active (is_active)
);

-- =====================================================
-- TABLA: GATOS
-- =====================================================
CREATE TABLE cats (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    breed VARCHAR(100),
    age VARCHAR(20),
    gender ENUM('MALE', 'FEMALE', 'UNKNOWN') DEFAULT 'UNKNOWN',
    birth_date DATE,
    size ENUM('SMALL', 'MEDIUM', 'LARGE') DEFAULT 'MEDIUM',
    main_image_url VARCHAR(500),
    description TEXT,
    story TEXT,
    personality TEXT,
    health_status ENUM('HEALTHY', 'SPECIAL_NEEDS', 'RECOVERING', 'CRITICAL') DEFAULT 'HEALTHY',
    is_vaccinated BOOLEAN DEFAULT FALSE,
    is_sterilized BOOLEAN DEFAULT FALSE,
    is_special_needs BOOLEAN DEFAULT FALSE,
    activity_level ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM',
    adoption_status ENUM('AVAILABLE', 'PENDING', 'ADOPTED', 'UNAVAILABLE') DEFAULT 'AVAILABLE',
    arrived_at DATE,
    adopted_at DATE,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_adoption_status (adoption_status),
    INDEX idx_featured (featured),
    INDEX idx_health_status (health_status),
    INDEX idx_gender (gender),
    INDEX idx_breed (breed)
);

-- =====================================================
-- TABLA: GALERÍA DE IMÁGENES DE GATOS
-- =====================================================
CREATE TABLE cat_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cat_id VARCHAR(50) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_type ENUM('MAIN', 'GALLERY') DEFAULT 'GALLERY',
    alt_text VARCHAR(255),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cat_id) REFERENCES cats(id) ON DELETE CASCADE,
    INDEX idx_cat_id (cat_id),
    INDEX idx_type (image_type),
    INDEX idx_display_order (display_order)
);

-- =====================================================
-- TABLA: SOLICITUDES DE ADOPCIÓN
-- Incluye campos sobre gastos que aparecen en el formulario
-- =====================================================
CREATE TABLE adoption_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cat_id VARCHAR(50) NOT NULL,
    application_number VARCHAR(20) UNIQUE NOT NULL,
    
    -- Información del candidato
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    birth_date DATE,
    city VARCHAR(100),
    dni VARCHAR(20),
    civil_status ENUM('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'),
    occupation VARCHAR(150),
    address TEXT,
    district VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    instagram VARCHAR(100),
    facebook VARCHAR(100),
    
    -- Experiencia con mascotas
    why_adopt TEXT,
    has_current_pets BOOLEAN DEFAULT FALSE,
    current_pets_details TEXT,
    had_previous_pets BOOLEAN DEFAULT FALSE,
    previous_pets_details TEXT,
    pets_where_are_now TEXT,
    pets_sterilized BOOLEAN DEFAULT FALSE,
    sterilization_reason TEXT,
    
    -- Hogar
    has_children BOOLEAN DEFAULT FALSE,
    children_ages VARCHAR(100),
    household_size VARCHAR(20),
    all_agree BOOLEAN DEFAULT FALSE,
    any_allergies BOOLEAN DEFAULT FALSE,
    living_type ENUM('RENTAL_ALLOWED', 'RENTAL_NOT_ALLOWED', 'UNKNOWN', 'OWN_HOUSE'),
    moving_plans TEXT,
    
    -- Recreación y proyección
    has_space BOOLEAN DEFAULT FALSE,
    access_areas TEXT,
    sleeping_place TEXT,
    has_escape_spaces BOOLEAN DEFAULT FALSE,
    behavior_issues_response TEXT,
    
    -- Cuidados y gastos (ESTO SÍ EXISTE EN EL FORMULARIO)
    who_pays_expenses VARCHAR(255), -- "¿Quién cubriría los gastos?"
    has_vet_resources BOOLEAN DEFAULT FALSE, -- "¿Cuentas con recursos para gastos veterinarios?"
    care_commitments JSON,
    sterilize_commitment BOOLEAN DEFAULT FALSE,
    accepts_visits BOOLEAN DEFAULT FALSE,
    accepts_terms BOOLEAN DEFAULT FALSE,
    
    -- Estado de la solicitud
    status ENUM('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'CANCELLED') DEFAULT 'PENDING',
    admin_notes TEXT,
    review_date TIMESTAMP NULL,
    reviewed_by BIGINT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cat_id) REFERENCES cats(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_cat_id (cat_id),
    INDEX idx_status (status),
    INDEX idx_email (email),
    INDEX idx_application_number (application_number),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- TABLA: ADOPCIONES COMPLETADAS
-- =====================================================
CREATE TABLE adoptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cat_id VARCHAR(50) NOT NULL,
    application_id BIGINT NOT NULL,
    adopter_user_id BIGINT,
    adoption_date DATE NOT NULL,
    adoption_fee DECIMAL(10,2) DEFAULT 0.00, -- S/. 150-250 como menciona la FAQ
    contract_signed BOOLEAN DEFAULT FALSE,
    contract_file_url VARCHAR(500),
    follow_up_required BOOLEAN DEFAULT TRUE,
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cat_id) REFERENCES cats(id) ON DELETE CASCADE,
    FOREIGN KEY (application_id) REFERENCES adoption_applications(id) ON DELETE CASCADE,
    FOREIGN KEY (adopter_user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_cat_id (cat_id),
    INDEX idx_application_id (application_id),
    INDEX idx_adoption_date (adoption_date),
    INDEX idx_follow_up (follow_up_required)
);

-- =====================================================
-- TABLA: VISITAS DE SEGUIMIENTO
-- =====================================================
CREATE TABLE follow_up_visits (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    adoption_id BIGINT NOT NULL,
    visit_date DATE NOT NULL,
    visit_type ENUM('SCHEDULED', 'EMERGENCY', 'ROUTINE') DEFAULT 'ROUTINE',
    visitor_name VARCHAR(255),
    cat_condition ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'CRITICAL') DEFAULT 'GOOD',
    home_condition ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR') DEFAULT 'GOOD',
    adopter_satisfaction ENUM('VERY_SATISFIED', 'SATISFIED', 'NEUTRAL', 'DISSATISFIED', 'VERY_DISSATISFIED') DEFAULT 'SATISFIED',
    notes TEXT,
    photos_urls JSON,
    next_visit_date DATE,
    visit_completed BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (adoption_id) REFERENCES adoptions(id) ON DELETE CASCADE,
    
    INDEX idx_adoption_id (adoption_id),
    INDEX idx_visit_date (visit_date),
    INDEX idx_next_visit (next_visit_date),
    INDEX idx_completed (visit_completed)
);

-- =====================================================
-- TABLA: DONACIONES
-- =====================================================
CREATE TABLE donations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    donor_name VARCHAR(255),
    donor_email VARCHAR(255),
    donor_phone VARCHAR(20),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'PEN',
    donation_type ENUM('MONEY', 'FOOD', 'MEDICINE', 'SUPPLIES', 'OTHER') DEFAULT 'MONEY',
    donation_method ENUM('YAPE', 'PLIN', 'BANK_TRANSFER', 'CASH', 'CARD', 'OTHER') DEFAULT 'YAPE',
    purpose ENUM('GENERAL', 'FOOD', 'VETERINARY', 'STERILIZATION', 'EMERGENCY', 'SPECIFIC_CAT') DEFAULT 'GENERAL',
    specific_cat_id VARCHAR(50),
    payment_reference VARCHAR(100),
    transaction_id VARCHAR(100),
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_frequency ENUM('WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'),
    status ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (specific_cat_id) REFERENCES cats(id) ON DELETE SET NULL,
    
    INDEX idx_status (status),
    INDEX idx_donation_type (donation_type),
    INDEX idx_amount (amount),
    INDEX idx_created_at (created_at),
    INDEX idx_donor_email (donor_email)
);

-- =====================================================
-- TABLA: BLOG POSTS
-- Incluye categoría 'EVENTS' para eventos/talleres que se mencionan en la página
-- =====================================================
CREATE TABLE blog_posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content LONGTEXT NOT NULL,
    excerpt TEXT,
    featured_image_url VARCHAR(500),
    author_id BIGINT,
    category ENUM('ADOPTION_STORIES', 'CAT_CARE', 'NEWS', 'EVENTS', 'EDUCATION', 'OTHER') DEFAULT 'OTHER',
    status ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') DEFAULT 'DRAFT',
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    published_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_featured (is_featured),
    INDEX idx_published_at (published_at)
);

-- =====================================================
-- TABLA: CONFIGURACIÓN DEL SISTEMA
-- =====================================================
CREATE TABLE system_config (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT,
    description TEXT,
    data_type ENUM('STRING', 'NUMBER', 'BOOLEAN', 'JSON') DEFAULT 'STRING',
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_config_key (config_key),
    INDEX idx_active (is_active)
);

-- =====================================================
-- INSERTAR DATOS INICIALES
-- =====================================================

-- Administrador por defecto
INSERT INTO users (email, password, full_name, role, is_active, email_verified) VALUES
('admin@adoptacat.org', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewGJ.2UHvBDe.cjG', 'Administrador AdoptaCat', 'ADMIN', TRUE, TRUE),
('gerencia@adoptacat.org', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewGJ.2UHvBDe.cjG', 'Gerencia AdoptaCat', 'ADMIN', TRUE, TRUE),
('director@adoptacat.org', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewGJ.2UHvBDe.cjG', 'Director AdoptaCat', 'ADMIN', TRUE, TRUE);

-- Gatos de ejemplo
INSERT INTO cats (id, name, breed, age, gender, description, story, personality, main_image_url, adoption_status, featured) VALUES
('luna', 'Luna', 'Doméstico Pelo Corto', '2 años', 'FEMALE', 'Luna es una gata cariñosa y tranquila', 'Luna fue rescatada de la calle y busca un hogar lleno de cariño. Le encanta jugar con pelotas y dormir al sol.', 'Cariñosa, tranquila y juguetona', '/assets/adoptacat/black-cat-with-yellow-eyes.jpg', 'AVAILABLE', TRUE),
('oliver', 'Oliver', 'Atigrado', '3 años', 'MALE', 'Oliver es un gato curioso y social', 'Oliver es un gatito explorador que disfruta de las ventanas y las siestas al mediodía.', 'Curioso y social', '/assets/adoptacat/orange-tabby-cat-lounging.jpg', 'AVAILABLE', TRUE),
('milo', 'Milo', 'Siamés Mestizo', '1 año', 'MALE', 'Milo es tímido pero muy leal', 'Milo se adapta mejor con cuidados y rutinas suaves. Cuando confía, es muy afectuoso.', 'Tímido pero muy leal', '/assets/adoptacat/siamese-blue-eyes.png', 'AVAILABLE', TRUE);

-- Imágenes de galería para los gatos
INSERT INTO cat_images (cat_id, image_url, image_type, alt_text, display_order) VALUES
('luna', '/assets/adoptacat/black-cat-with-yellow-eyes.jpg', 'MAIN', 'Luna - Gata negra con ojos amarillos', 1),
('luna', '/assets/adoptacat/gray-cat-with-green-eyes.jpg', 'GALLERY', 'Luna descansando', 2),
('oliver', '/assets/adoptacat/orange-tabby-cat-lounging.jpg', 'MAIN', 'Oliver - Gato atigrado naranja', 1),
('oliver', '/assets/adoptacat/orange-tabby-cat-sitting.jpg', 'GALLERY', 'Oliver sentado', 2),
('milo', '/assets/adoptacat/siamese-blue-eyes.png', 'MAIN', 'Milo - Siamés con ojos azules', 1);

-- Configuración del sistema
INSERT INTO system_config (config_key, config_value, description, data_type) VALUES
('site_name', 'AdoptaCat Chiclayo', 'Nombre del sitio web', 'STRING'),
('contact_email', 'contacto@adoptacat.org', 'Email de contacto principal', 'STRING'),
('contact_phone', '+51 999 888 777', 'Teléfono de contacto', 'STRING'),
('adoption_fee_min', '150.00', 'Tarifa mínima de adopción en soles', 'NUMBER'),
('adoption_fee_max', '250.00', 'Tarifa máxima de adopción en soles', 'NUMBER'),
('max_applications_per_user', '3', 'Máximo de solicitudes por usuario', 'NUMBER'),
('follow_up_visits_required', 'true', 'Requiere visitas de seguimiento', 'BOOLEAN'),
('yape_number', '999 888 777', 'Número de Yape para donaciones', 'STRING'),
('plin_number', '999 888 777', 'Número de Plin para donaciones', 'STRING'),
('food_goal_monthly', '200', 'Meta mensual de alimento en kg', 'NUMBER'),
('cats_benefited', '150', 'Número de gatos que se benefician', 'NUMBER');

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista de gatos disponibles con información completa
CREATE VIEW available_cats AS
SELECT 
    c.*,
    COUNT(ci.id) as image_count,
    GROUP_CONCAT(ci.image_url) as gallery_urls
FROM cats c
LEFT JOIN cat_images ci ON c.id = ci.cat_id
WHERE c.adoption_status = 'AVAILABLE'
GROUP BY c.id;

-- Vista de solicitudes pendientes
CREATE VIEW pending_applications AS
SELECT 
    aa.*,
    c.name as cat_name,
    c.breed,
    c.age as cat_age
FROM adoption_applications aa
JOIN cats c ON aa.cat_id = c.id
WHERE aa.status = 'PENDING'
ORDER BY aa.created_at ASC;

-- Vista de estadísticas de adopciones
CREATE VIEW adoption_stats AS
SELECT 
    COUNT(*) as total_adoptions,
    YEAR(adoption_date) as year,
    MONTH(adoption_date) as month,
    SUM(adoption_fee) as total_fees
FROM adoptions
GROUP BY YEAR(adoption_date), MONTH(adoption_date)
ORDER BY year DESC, month DESC;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger para actualizar el estado del gato cuando se adopta
DELIMITER //
CREATE TRIGGER update_cat_adoption_status 
AFTER INSERT ON adoptions
FOR EACH ROW
BEGIN
    UPDATE cats 
    SET adoption_status = 'ADOPTED', adopted_at = NEW.adoption_date 
    WHERE id = NEW.cat_id;
END;//

-- Trigger para generar número de solicitud automáticamente
CREATE TRIGGER generate_application_number
BEFORE INSERT ON adoption_applications
FOR EACH ROW
BEGIN
    DECLARE next_number INT;
    SELECT COALESCE(MAX(CAST(SUBSTRING(application_number, 4) AS UNSIGNED)), 0) + 1 
    INTO next_number 
    FROM adoption_applications 
    WHERE application_number LIKE CONCAT('APP', YEAR(NOW()), '%');
    
    SET NEW.application_number = CONCAT('APP', YEAR(NOW()), LPAD(next_number, 4, '0'));
END;//

DELIMITER ;

-- =====================================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- =====================================================

-- Índice compuesto para búsquedas de gatos
CREATE INDEX idx_cats_search ON cats(adoption_status, featured, breed, gender);

-- Índice para reportes de donaciones
CREATE INDEX idx_donations_reports ON donations(donation_type, status, created_at);

-- Índice para seguimiento de adopciones
CREATE INDEX idx_adoptions_follow_up ON adoptions(follow_up_required, adoption_date);

-- =====================================================
