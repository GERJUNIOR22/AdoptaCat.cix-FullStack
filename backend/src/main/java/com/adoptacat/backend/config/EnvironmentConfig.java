package com.adoptacat.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

/**
 * Configuración para cargar variables de entorno desde archivo .env
 */
@Configuration
public class EnvironmentConfig {

    private static final Logger logger = LoggerFactory.getLogger(EnvironmentConfig.class);

    @PostConstruct
    public void loadEnvironmentVariables() {
        try {
            String envFilePath = ".env";
            if (Files.exists(Paths.get(envFilePath))) {
                List<String> lines = Files.readAllLines(Paths.get(envFilePath));
                for (String line : lines) {
                    if (line.contains("=") && !line.startsWith("#")) {
                        String[] parts = line.split("=", 2);
                        if (parts.length == 2) {
                            String key = parts[0].trim();
                            String value = parts[1].trim();
                            System.setProperty(key, value);
                        }
                    }
                }
                logger.info("Variables de entorno cargadas desde .env");
            }
        } catch (IOException e) {
            logger.error("Error cargando archivo .env: {}", e.getMessage());
        }
    }
}