package com.adoptacat.backend.controller;

import com.adoptacat.backend.model.User;
import com.adoptacat.backend.service.UserService;
import com.adoptacat.backend.util.AdoptaCatUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Controlador para autenticación y manejo de sesiones
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final AdoptaCatUtils utils;
    
    private static final String ERROR_INTERNO_SERVIDOR = "Error interno del servidor";

    public AuthController(UserService userService, PasswordEncoder passwordEncoder, AdoptaCatUtils utils) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.utils = utils;
    }

    /**
     * Login de usuario
     */
    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody LoginRequest request) {
        try {
            // Validar campos requeridos
            if (request.getEmail() == null || request.getPassword() == null) {
                return ResponseEntity.badRequest().body(new ErrorResponse("Email y contraseña son requeridos"));
            }

            // Buscar usuario por email
            Optional<User> userOpt = userService.findByEmail(request.getEmail());
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Credenciales inválidas"));
            }

            User user = userOpt.get();

            // Verificar si el usuario está activo
            if (Boolean.FALSE.equals(user.getIsActive())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ErrorResponse("Usuario desactivado"));
            }

            // Verificar contraseña
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                // Log de intento de login fallido
                utils.logSecurityEvent("FAILED_LOGIN_ATTEMPT", request.getEmail(), 
                    "Intento de login con contraseña incorrecta");
                
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Credenciales inválidas"));
            }

            // Log de login exitoso
            utils.logAuditAction("USER_LOGIN", user.getEmail(), 
                "Usuario autenticado exitosamente");

            // Crear respuesta de login exitoso
            LoginResponse response = new LoginResponse();
            response.setId(user.getId());
            response.setEmail(user.getEmail());
            response.setName(user.getFullName());
            response.setRole(user.getRole().toString());
            response.setIsAdmin(user.getRole() == User.Role.ADMIN);
            response.setEmailVerified(user.getEmailVerified());
            response.setProfileImageUrl(user.getProfileImageUrl());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            utils.logSecurityEvent("LOGIN_ERROR", request.getEmail(), 
                "Error durante el proceso de login: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse(ERROR_INTERNO_SERVIDOR));
        }
    }

    /**
     * Registro de nuevo usuario
     */
    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody RegisterRequest request) {
        try {
            // Validar campos requeridos
            if (request.getEmail() == null || request.getPassword() == null || request.getFullName() == null) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Todos los campos son requeridos"));
            }

            // Validar formato de email
            if (!isValidEmail(request.getEmail())) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Formato de email inválido"));
            }

            // Verificar si el usuario ya existe
            if (userService.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse("El email ya está registrado"));
            }

            // Validar contraseña (mínimo 8 caracteres)
            if (request.getPassword().length() < 8) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("La contraseña debe tener al menos 8 caracteres"));
            }

            // Crear nuevo usuario
            User newUser = new User();
            newUser.setEmail(request.getEmail());
            newUser.setPassword(passwordEncoder.encode(request.getPassword()));
            newUser.setFullName(request.getFullName());
            newUser.setPhone(request.getPhone());
            newUser.setRole(User.Role.USER); // Por defecto, rol USER
            newUser.setIsActive(true);
            newUser.setEmailVerified(false);

            User savedUser = userService.createUser(newUser);

            // Log de registro exitoso
            utils.logAuditAction("USER_REGISTER", savedUser.getEmail(), 
                "Nuevo usuario registrado exitosamente");

            // Crear respuesta
            RegisterResponse response = new RegisterResponse();
            response.setId(savedUser.getId());
            response.setEmail(savedUser.getEmail());
            response.setName(savedUser.getFullName());
            response.setMessage("Usuario registrado exitosamente");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            utils.logSecurityEvent("REGISTER_ERROR", request.getEmail(), 
                "Error durante el registro: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse(ERROR_INTERNO_SERVIDOR));
        }
    }

    /**
     * Verificar si el usuario tiene rol de administrador
     */
    @GetMapping("/check-admin/{email}")
    public ResponseEntity<AdminCheckResponse> checkAdminRole(@PathVariable String email) {
        try {
            Optional<User> userOpt = userService.findByEmail(email);
            if (!userOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            User user = userOpt.get();
            AdminCheckResponse response = new AdminCheckResponse();
            response.setIsAdmin(user.getRole() == User.Role.ADMIN);
            response.setIsActive(user.getIsActive());
            
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Cambiar contraseña
     */
    @PostMapping("/change-password")
    public ResponseEntity<Object> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            // Validar campos requeridos
            if (request.getEmail() == null || request.getCurrentPassword() == null || 
                request.getNewPassword() == null) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Todos los campos son requeridos"));
            }

            // Buscar usuario
            Optional<User> userOpt = userService.findByEmail(request.getEmail());
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Usuario no encontrado"));
            }

            User user = userOpt.get();

            // Verificar contraseña actual
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Contraseña actual incorrecta"));
            }

            // Validar nueva contraseña
            if (request.getNewPassword().length() < 8) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("La nueva contraseña debe tener al menos 8 caracteres"));
            }

            // Actualizar contraseña
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userService.updateUser(user.getId(), user);

            // Log de cambio de contraseña
            utils.logAuditAction("PASSWORD_CHANGE", user.getEmail(), 
                "Contraseña cambiada exitosamente");

            return ResponseEntity.ok(new SuccessResponse("Contraseña actualizada exitosamente"));

        } catch (Exception e) {
            utils.logSecurityEvent("PASSWORD_CHANGE_ERROR", request.getEmail(), 
                "Error al cambiar contraseña: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse(ERROR_INTERNO_SERVIDOR));
        }
    }

    /**
     * Logout (opcional - para limpiar logs)
     */
    @PostMapping("/logout")
    public ResponseEntity<Object> logout(@RequestBody LogoutRequest request) {
        try {
            if (request.getEmail() != null) {
                utils.logAuditAction("USER_LOGOUT", request.getEmail(), "Usuario cerró sesión");
            }
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(new SuccessResponse("Logout exitoso"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(new SuccessResponse("Logout procesado"));
        }
    }

    // ============================================
    // CLASES PARA REQUESTS Y RESPONSES
    // ============================================

    public static class LoginRequest {
        private String email;
        private String password;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class LoginResponse {
        private Long id;
        private String email;
        private String name;
        private String role;
        private Boolean isAdmin;
        private Boolean emailVerified;
        private String profileImageUrl;
        
        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        
        public Boolean getIsAdmin() { return isAdmin; }
        public void setIsAdmin(Boolean isAdmin) { this.isAdmin = isAdmin; }
        
        public Boolean getEmailVerified() { return emailVerified; }
        public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }
        
        public String getProfileImageUrl() { return profileImageUrl; }
        public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }
    }

    public static class RegisterRequest {
        private String email;
        private String password;
        private String fullName;
        private String phone;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
    }

    public static class RegisterResponse {
        private Long id;
        private String email;
        private String name;
        private String message;
        
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class AdminCheckResponse {
        private Boolean isAdmin;
        private Boolean isActive;
        
        public Boolean getIsAdmin() { return isAdmin; }
        public void setIsAdmin(Boolean isAdmin) { this.isAdmin = isAdmin; }
        
        public Boolean getIsActive() { return isActive; }
        public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    }

    public static class ChangePasswordRequest {
        private String email;
        private String currentPassword;
        private String newPassword;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getCurrentPassword() { return currentPassword; }
        public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
        
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    public static class LogoutRequest {
        private String email;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public static class ErrorResponse {
        private String message;
        private LocalDateTime timestamp;
        
        public ErrorResponse(String message) {
            this.message = message;
            this.timestamp = LocalDateTime.now();
        }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        
        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    }

    public static class SuccessResponse {
        private String message;
        private LocalDateTime timestamp;
        
        public SuccessResponse(String message) {
            this.message = message;
            this.timestamp = LocalDateTime.now();
        }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        
        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    }
    
    // Método de utilidad para validar email
    private boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        
        // Expresión regular básica para validar email
        String emailRegex = "^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$";
        return email.matches(emailRegex);
    }
}