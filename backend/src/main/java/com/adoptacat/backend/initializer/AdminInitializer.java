package com.adoptacat.backend.initializer;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.adoptacat.backend.model.User;
import com.adoptacat.backend.repository.UserRepository;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@adoptacat.com";

        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setEmail(adminEmail);
            admin.setFullName("Administrador del Sistema");
            admin.setPassword(passwordEncoder.encode("Admin123*"));
            admin.setRole(User.Role.ADMIN);
            admin.setIsActive(true);
            admin.setEmailVerified(true);

            userRepository.save(admin);

            System.out.println("⚙️  Usuario ADMIN creado correctamente.");
        } else {
            System.out.println("✔️  Usuario ADMIN ya existía, no se creó uno nuevo.");
        }
    }
}
