package com.adoptacat.backend.config;

import com.adoptacat.backend.model.User;
import com.adoptacat.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "admin@adoptacat.com";

            if (!userRepository.existsByEmail(adminEmail)) {
                User admin = new User();
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode("admin123")); // Contraseña por defecto
                admin.setFullName("Administrador Sistema");
                admin.setRole(User.Role.ADMIN);
                admin.setPerfilCompleto(true);

                userRepository.save(admin);
                System.out.println("✅ Usuario ADMIN creado: " + adminEmail + " / admin123");
            } else {
                System.out.println("ℹ️ El usuario ADMIN ya existe.");
            }
        };
    }
}
