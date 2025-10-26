package com.adoptacat.backend.util;

import com.google.common.base.Preconditions;
import com.google.common.base.Strings;
import com.google.common.collect.Lists;
import com.google.common.hash.Hashing;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.io.FileUtils;
import org.owasp.encoder.Encode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collection;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Clase de utilidades que aprovecha las librerías Google Guava y Apache Commons
 * para mejorar la eficiencia y funcionalidad del proyecto.
 */
@Component
public class AdoptaCatUtils {
    
    private static final Logger logger = LoggerFactory.getLogger(AdoptaCatUtils.class);
    private static final Logger auditLogger = LoggerFactory.getLogger("AUDIT");
    
    // Patrones de validación para seguridad
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$"
    );
    
    private static final Pattern PHONE_PATTERN = Pattern.compile(
        "^[+]?[0-9]{9,15}$"
    );
    
    private static final Pattern ALPHANUMERIC_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9]+$"
    );
    
    // Constantes de seguridad
    private static final int MAX_TEXT_LENGTH = 5000;
    private static final int MAX_NAME_LENGTH = 100;
    private static final int MAX_EMAIL_LENGTH = 254;
    
    /**
     * Genera un ID único para gatos usando Guava y timestamp
     */
    public String generateCatId() {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String randomSuffix = RandomStringUtils.secure().nextAlphanumeric(4).toUpperCase();
        return "CAT" + timestamp + randomSuffix;
    }
    
    /**
     * Genera un número de aplicación único
     */
    public String generateApplicationNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String randomSuffix = RandomStringUtils.secure().nextAlphanumeric(3).toUpperCase();
        return "APP" + timestamp + randomSuffix;
    }
    
    /**
     * Valida y sanitiza el email usando Apache Commons y OWASP Encoder
     */
    public String validateAndSanitizeEmail(String email) {
        Preconditions.checkArgument(!Strings.isNullOrEmpty(email), "El email no puede estar vacío");
        
        String trimmedEmail = StringUtils.trim(email);
        Preconditions.checkArgument(trimmedEmail.length() <= MAX_EMAIL_LENGTH, 
            "El email excede la longitud máxima permitida");
        
        String normalizedEmail = StringUtils.lowerCase(trimmedEmail);
        
        if (!EMAIL_PATTERN.matcher(normalizedEmail).matches()) {
            logger.warn("Intento de registro con email inválido: {}", 
                Encode.forJava(normalizedEmail));
            throw new IllegalArgumentException("Formato de email inválido");
        }
        
        auditLogger.info("Email validado exitosamente para: {}", 
            Encode.forJava(normalizedEmail));
        
        return normalizedEmail;
    }
    
    /**
     * Valida y sanitiza el nombre usando Apache Commons y OWASP Encoder
     */
    public String validateAndSanitizeName(String name) {
        Preconditions.checkArgument(!Strings.isNullOrEmpty(name), 
            "El nombre no puede estar vacío");
        
        String trimmedName = StringUtils.trim(name);
        Preconditions.checkArgument(trimmedName.length() <= MAX_NAME_LENGTH, 
            "El nombre excede la longitud máxima permitida");
        
        // Normalizar espacios múltiples
        String normalizedName = StringUtils.normalizeSpace(trimmedName);
        
        // Capitalizar palabras
        String capitalizedName = StringUtils.capitalize(normalizedName);
        
        // Sanitizar para prevenir XSS
        return Encode.forHtml(capitalizedName);
    }
    
    /**
     * Valida número de teléfono
     */
    public String validateAndSanitizePhone(String phone) {
        if (Strings.isNullOrEmpty(phone)) {
            return null; // El teléfono es opcional
        }
        
        String cleanPhone = StringUtils.replaceChars(phone, " ()-.", "");
        
        if (!PHONE_PATTERN.matcher(cleanPhone).matches()) {
            logger.warn("Intento de registro con teléfono inválido: {}", 
                Encode.forJava(phone));
            throw new IllegalArgumentException("Formato de teléfono inválido");
        }
        
        return cleanPhone;
    }
    
    /**
     * Valida y sanitiza texto libre (descripciones, comentarios, etc.)
     */
    public String validateAndSanitizeText(String text) {
        if (Strings.isNullOrEmpty(text)) {
            return null;
        }
        
        String trimmedText = StringUtils.trim(text);
        Preconditions.checkArgument(trimmedText.length() <= MAX_TEXT_LENGTH, 
            "El texto excede la longitud máxima permitida");
        
        // Normalizar espacios y líneas
        String normalizedText = StringUtils.normalizeSpace(trimmedText);
        
        // Sanitizar para prevenir XSS
        return Encode.forHtml(normalizedText);
    }
    
    /**
     * Valida ID alfanumérico
     */
    public boolean isValidAlphanumericId(String id) {
        if (Strings.isNullOrEmpty(id)) {
            return false;
        }
        return ALPHANUMERIC_PATTERN.matcher(id).matches();
    }
    
    /**
     * Genera hash seguro usando Guava
     */
    public String generateSecureHash(String input) {
        Preconditions.checkArgument(!Strings.isNullOrEmpty(input), 
            "El input para hash no puede estar vacío");
        
        return Hashing.sha256()
            .hashString(input, StandardCharsets.UTF_8)
            .toString();
    }
    
    /**
     * Procesa lista de manera segura usando Guava y Apache Commons
     */
    public <T> List<T> processSafeList(Collection<T> input) {
        if (CollectionUtils.isEmpty(input)) {
            return Lists.newArrayList();
        }
        
        return Lists.newArrayList(input);
    }
    
    /**
     * Procesa lista de strings sanitizándola
     */
    public List<String> processSafeStringList(Collection<String> input) {
        if (CollectionUtils.isEmpty(input)) {
            return Lists.newArrayList();
        }
        
        return input.stream()
            .filter(s -> !Strings.isNullOrEmpty(s))
            .map(StringUtils::trim)
            .map(Encode::forHtml)
            .collect(Collectors.toList());
    }
    
    /**
     * Escribe archivo de manera segura usando Apache Commons IO
     */
    public void writeSecureFile(String content, String filePath) throws IOException {
        Preconditions.checkArgument(!Strings.isNullOrEmpty(content), 
            "El contenido no puede estar vacío");
        Preconditions.checkArgument(!Strings.isNullOrEmpty(filePath), 
            "La ruta del archivo no puede estar vacía");
        
        File file = new File(filePath);
        
        // Validar que el archivo esté en un directorio permitido
        String canonicalPath = file.getCanonicalPath();
        if (!canonicalPath.startsWith(System.getProperty("user.dir"))) {
            throw new SecurityException("Ruta de archivo no permitida");
        }
        
        FileUtils.writeStringToFile(file, content, StandardCharsets.UTF_8);
        
        auditLogger.info("Archivo escrito exitosamente: {}", 
            Encode.forJava(filePath));
    }
    
    /**
     * Lee archivo de manera segura usando Apache Commons IO
     */
    public String readSecureFile(String filePath) throws IOException {
        Preconditions.checkArgument(!Strings.isNullOrEmpty(filePath), 
            "La ruta del archivo no puede estar vacía");
        
        File file = new File(filePath);
        
        // Validar que el archivo existe y es legible
        if (!file.exists() || !file.canRead()) {
            throw new IOException("El archivo no existe o no es legible");
        }
        
        // Validar que el archivo esté en un directorio permitido
        String canonicalPath = file.getCanonicalPath();
        if (!canonicalPath.startsWith(System.getProperty("user.dir"))) {
            throw new SecurityException("Ruta de archivo no permitida");
        }
        
        String content = FileUtils.readFileToString(file, StandardCharsets.UTF_8);
        
        auditLogger.info("Archivo leído exitosamente: {}", 
            Encode.forJava(filePath));
        
        return content;
    }
    
    /**
     * Valida tamaño de archivo
     */
    public boolean isValidFileSize(File file, long maxSizeBytes) {
        return file != null && file.exists() && file.length() <= maxSizeBytes;
    }
    
    /**
     * Log de auditoría para acciones críticas
     */
    public void logAuditAction(String action, String userId, String details) {
        String sanitizedAction = Encode.forJava(action);
        String sanitizedUserId = Encode.forJava(userId);
        String sanitizedDetails = Encode.forJava(details);
        
        auditLogger.info("AUDIT: Action={}, User={}, Details={}, Timestamp={}", 
            sanitizedAction, sanitizedUserId, sanitizedDetails, LocalDateTime.now());
    }
    
    /**
     * Log de seguridad para eventos sospechosos
     */
    public void logSecurityEvent(String event, String source, String details) {
        String sanitizedEvent = Encode.forJava(event);
        String sanitizedSource = Encode.forJava(source);
        String sanitizedDetails = Encode.forJava(details);
        
        logger.warn("SECURITY: Event={}, Source={}, Details={}, Timestamp={}", 
            sanitizedEvent, sanitizedSource, sanitizedDetails, LocalDateTime.now());
    }
}