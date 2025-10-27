-- Datos de ejemplo para la aplicación AdoptaCat
-- Insertar gatos adicionales para testing

INSERT INTO cats (id, name, breed, age, gender, birth_date, size, main_image_url, description, story, personality, health_status, is_vaccinated, is_sterilized, is_special_needs, activity_level, adoption_status, arrived_at, featured, created_at, updated_at) VALUES
('milo', 'Milo', 'Siamés Mestizo', '1 año', 'MALE', '2023-10-01', 'MEDIUM', 'assets/gatos/gatofondo.webp', 'Un joven aventurero muy inteligente', 'Milo es un gatito joven lleno de energía y curiosidad', 'Muy Curioso, Aventurero, Inteligente', 'HEALTHY', true, false, false, 'HIGH', 'AVAILABLE', '2024-07-15', true, NOW(), NOW()),

('oliver', 'Oliver', 'Atigrado', '3 años', 'MALE', '2021-01-15', 'LARGE', 'assets/gatos/milaneso.webp', 'Un gato maduro y tranquilo, ideal para familias', 'Oliver es un gatito explorador que disfruta de las ventanas', 'Tranquilo y Gentil, Sociable, Cariñoso', 'HEALTHY', true, true, false, 'MEDIUM', 'AVAILABLE', '2024-09-01', true, NOW(), NOW()),

('bella', 'Bella', 'Persa', '2 años', 'FEMALE', '2022-05-10', 'SMALL', 'assets/gatos/bella.webp', 'Una gatita elegante y cariñosa', 'Bella es una gatita muy elegante que ama los mimos', 'Elegante, Cariñosa, Tranquila', 'HEALTHY', true, true, false, 'LOW', 'AVAILABLE', '2024-08-20', false, NOW(), NOW()),

('simba', 'Simba', 'Maine Coon', '4 años', 'MALE', '2020-03-22', 'LARGE', 'assets/gatos/simba.webp', 'Un gigante gentil con corazón de oro', 'Simba es un gato grande pero muy gentil y protector', 'Protector, Gentil, Leal', 'HEALTHY', true, true, false, 'MEDIUM', 'AVAILABLE', '2024-06-10', true, NOW(), NOW()),

('nala', 'Nala', 'Bengalí', '1.5 años', 'FEMALE', '2023-04-18', 'MEDIUM', 'assets/gatos/nala.webp', 'Una gatita activa con patrones únicos', 'Nala tiene un pelaje hermoso y es muy activa', 'Activa, Juguetona, Independiente', 'HEALTHY', true, false, false, 'HIGH', 'AVAILABLE', '2024-10-01', false, NOW(), NOW());