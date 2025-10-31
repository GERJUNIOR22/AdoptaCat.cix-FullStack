package com.adoptacat.backend.service;

import com.adoptacat.backend.model.User;
import com.adoptacat.backend.repository.UserRepository;
import com.adoptacat.backend.util.AdoptaCatUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Servicio para la gestión de usuarios
 */
@Service
@Transactional
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final AdoptaCatUtils utils;

    public UserService(UserRepository userRepository, AdoptaCatUtils utils) {
        this.userRepository = userRepository;
        this.utils = utils;
    }

    // ============================================
    // OPERACIONES BÁSICAS CRUD
    // ============================================

    /**
     * Crear nuevo usuario
     */
    public User createUser(User user) {
        try {
            // Validar datos
            if (user.getEmail() == null || user.getPassword() == null || user.getFullName() == null) {
                throw new IllegalArgumentException("Campos requeridos faltantes");
            }

            // Verificar si el email ya existe
            if (findByEmail(user.getEmail()).isPresent()) {
                throw new IllegalArgumentException("El email ya está registrado");
            }

            // Establecer valores por defecto si no están establecidos
            if (user.getRole() == null) {
                user.setRole(User.Role.USER);
            }
            if (user.getIsActive() == null) {
                user.setIsActive(true);
            }
            if (user.getEmailVerified() == null) {
                user.setEmailVerified(false);
            }

            User savedUser = userRepository.save(user);
            
            utils.logAuditAction("USER_CREATED", savedUser.getEmail(), 
                "Usuario creado con rol: " + savedUser.getRole());
            
            return savedUser;

        } catch (Exception e) { // NOSONAR - Exception is logged and rethrown with context
            logger.error("Error al crear usuario con email {}: {}", 
                user != null ? user.getEmail() : "null", e.getMessage(), e);
            throw new UserCreationException("Error al crear usuario", e);
        }
    }

    /**
     * Buscar usuario por email
     */
    public Optional<User> findByEmail(String email) {
        try {
            return userRepository.findByEmail(email);
        } catch (Exception e) {
            logger.error("Error al buscar usuario por email: {}", e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * Obtener usuario por ID
     */
    public Optional<User> getUserById(Long id) {
        try {
            return userRepository.findById(id);
        } catch (Exception e) {
            logger.error("Error al obtener usuario por ID: {}", e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * Obtener todos los usuarios con paginación
     */
    public Page<User> getAllUsers(int page, int size, String sortBy, String sortDirection) {
        try {
            Sort sort = sortDirection.equalsIgnoreCase("desc") 
                ? Sort.by(sortBy).descending() 
                : Sort.by(sortBy).ascending();
            
            Pageable pageable = PageRequest.of(page, size, sort);
            return userRepository.findAll(pageable);

        } catch (Exception e) { // NOSONAR - Exception is logged and rethrown with context
            logger.error("Error al obtener usuarios con paginación [page: {}, size: {}]: {}", 
                page, size, e.getMessage(), e);
            throw new UserSearchException("Error al obtener usuarios", e);
        }
    }

    /**
     * Actualizar usuario
     */
    public User updateUser(Long id, User userDetails) {
        try {
            Optional<User> userOpt = userRepository.findById(id);
            if (!userOpt.isPresent()) {
                throw new IllegalArgumentException("Usuario no encontrado");
            }

            User existingUser = userOpt.get();
            
            // Actualizar campos (no actualizar password aquí)
            if (userDetails.getFullName() != null) {
                existingUser.setFullName(userDetails.getFullName());
            }
            if (userDetails.getPhone() != null) {
                existingUser.setPhone(userDetails.getPhone());
            }
            if (userDetails.getRole() != null) {
                existingUser.setRole(userDetails.getRole());
            }
            if (userDetails.getIsActive() != null) {
                existingUser.setIsActive(userDetails.getIsActive());
            }
            if (userDetails.getEmailVerified() != null) {
                existingUser.setEmailVerified(userDetails.getEmailVerified());
            }
            if (userDetails.getProfileImageUrl() != null) {
                existingUser.setProfileImageUrl(userDetails.getProfileImageUrl());
            }

            User updatedUser = userRepository.save(existingUser);
            
            utils.logAuditAction("USER_UPDATED", updatedUser.getEmail(), 
                "Usuario actualizado por administrador");
            
            return updatedUser;

        } catch (Exception e) { // NOSONAR - Exception is logged and rethrown with context
            logger.error("Error al actualizar usuario con ID {}: {}", 
                id, e.getMessage(), e);
            throw new UserUpdateException("Error al actualizar usuario", e);
        }
    }

    /**
     * Cambiar rol de usuario
     */
    public User changeUserRole(Long id, User.Role newRole) {
        try {
            Optional<User> userOpt = userRepository.findById(id);
            if (!userOpt.isPresent()) {
                throw new IllegalArgumentException("Usuario no encontrado");
            }

            User user = userOpt.get();
            User.Role oldRole = user.getRole();
            user.setRole(newRole);

            User updatedUser = userRepository.save(user);
            
            utils.logAuditAction("USER_ROLE_CHANGED", updatedUser.getEmail(), 
                String.format("Rol cambiado de %s a %s", oldRole, newRole));
            
            return updatedUser;

        } catch (Exception e) { // NOSONAR - Exception is logged and rethrown with context
            logger.error("Error al cambiar rol de usuario con ID {} a rol {}: {}", 
                id, newRole, e.getMessage(), e);
            throw new UserUpdateException("Error al cambiar rol de usuario", e);
        }
    }

    /**
     * Activar/Desactivar usuario
     */
    public User toggleUserStatus(Long id) {
        try {
            Optional<User> userOpt = userRepository.findById(id);
            if (!userOpt.isPresent()) {
                throw new IllegalArgumentException("Usuario no encontrado");
            }

            User user = userOpt.get();
            user.setIsActive(!user.getIsActive());

            User updatedUser = userRepository.save(user);
            
            String status = Boolean.TRUE.equals(updatedUser.getIsActive()) ? "activado" : "desactivado";
            utils.logAuditAction("USER_STATUS_CHANGED", updatedUser.getEmail(), 
                "Usuario " + status);
            
            return updatedUser;

        } catch (Exception e) { // NOSONAR - Exception is logged and rethrown with context
            logger.error("Error al cambiar estado de usuario con ID {}: {}", 
                id, e.getMessage(), e);
            throw new UserUpdateException("Error al cambiar estado de usuario", e);
        }
    }

    /**
     * Eliminar usuario
     */
    public void deleteUser(Long id) {
        try {
            Optional<User> userOpt = userRepository.findById(id);
            if (!userOpt.isPresent()) {
                throw new IllegalArgumentException("Usuario no encontrado");
            }

            User user = userOpt.get();
            
            // Verificar que no es el último administrador
            if (user.getRole() == User.Role.ADMIN) {
                long adminCount = userRepository.countByRoleAndIsActive(User.Role.ADMIN, true);
                if (adminCount <= 1) {
                    throw new IllegalArgumentException("No se puede eliminar el último administrador activo");
                }
            }

            userRepository.deleteById(id);
            
            utils.logAuditAction("USER_DELETED", user.getEmail(), 
                "Usuario eliminado permanentemente");

        } catch (Exception e) { // NOSONAR - Exception is logged and rethrown with context
            logger.error("Error al eliminar usuario con ID {}: {}", 
                id, e.getMessage(), e);
            throw new UserUpdateException("Error al eliminar usuario", e);
        }
    }

    // ============================================
    // MÉTODOS DE ESTADÍSTICAS
    // ============================================

    /**
     * Contar todos los usuarios
     */
    public Long countAllUsers() {
        try {
            return userRepository.count();
        } catch (Exception e) {
            logger.error("Error al contar usuarios: {}", e.getMessage());
            return 0L;
        }
    }

    /**
     * Contar usuarios activos
     */
    public Long countActiveUsers() {
        try {
            return userRepository.countByIsActive(true);
        } catch (Exception e) {
            logger.error("Error al contar usuarios activos: {}", e.getMessage());
            return 0L;
        }
    }

    /**
     * Contar administradores
     */
    public Long countAdminUsers() {
        try {
            return userRepository.countByRoleAndIsActive(User.Role.ADMIN, true);
        } catch (Exception e) {
            logger.error("Error al contar administradores: {}", e.getMessage());
            return 0L;
        }
    }

    /**
     * Obtener usuarios recientes
     */
    public List<User> getRecentUsers(int limit) {
        try {
            Pageable pageable = PageRequest.of(0, limit, Sort.by("createdAt").descending());
            return userRepository.findAll(pageable).getContent();
        } catch (Exception e) { // NOSONAR - Exception is logged and rethrown with context
            logger.error("Error al obtener usuarios recientes [limit: {}]: {}", 
                limit, e.getMessage(), e);
            throw new UserSearchException("Error al obtener usuarios recientes", e);
        }
    }

    // ============================================
    // MÉTODOS DE BÚSQUEDA Y FILTRADO
    // ============================================

    /**
     * Buscar usuarios por nombre
     */
    public List<User> searchUsersByName(String name) {
        try {
            return userRepository.findByFullNameContainingIgnoreCase(name);
        } catch (Exception e) { // NOSONAR - Exception is logged and rethrown with context
            logger.error("Error al buscar usuarios por nombre '{}': {}", 
                name, e.getMessage(), e);
            throw new UserSearchException("Error al buscar usuarios", e);
        }
    }

    /**
     * Obtener usuarios por rol
     */
    public List<User> getUsersByRole(User.Role role) {
        try {
            return userRepository.findByRole(role);
        } catch (Exception e) { // NOSONAR - Exception is logged and rethrown with context
            logger.error("Error al obtener usuarios por rol {}: {}", 
                role, e.getMessage(), e);
            throw new UserSearchException("Error al obtener usuarios por rol", e);
        }
    }

    /**
     * Obtener usuarios activos
     */
    public List<User> getActiveUsers() {
        try {
            return userRepository.findByIsActive(true);
        } catch (Exception e) { // NOSONAR - Exception is logged and rethrown with context
            logger.error("Error al obtener usuarios activos: {}", e.getMessage(), e);
            throw new UserSearchException("Error al obtener usuarios activos", e);
        }
    }

    // ============================================
    // MÉTODOS DE VALIDACIÓN
    // ============================================

    /**
     * Verificar si el usuario es administrador
     */
    public boolean isUserAdmin(String email) {
        try {
            Optional<User> userOpt = findByEmail(email);
            return userOpt.isPresent() && 
                   userOpt.get().getRole() == User.Role.ADMIN && 
                   userOpt.get().getIsActive();
        } catch (Exception e) {
            logger.error("Error al verificar rol de administrador: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Verificar si el usuario existe y está activo
     */
    public boolean isUserActiveByEmail(String email) {
        try {
            Optional<User> userOpt = findByEmail(email);
            return userOpt.isPresent() && userOpt.get().getIsActive();
        } catch (Exception e) {
            logger.error("Error al verificar estado de usuario: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Excepciones personalizadas para el servicio de usuarios
     */
    public static class UserServiceException extends RuntimeException {
        public UserServiceException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    public static class UserCreationException extends UserServiceException {
        public UserCreationException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    public static class UserUpdateException extends UserServiceException {
        public UserUpdateException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    public static class UserSearchException extends UserServiceException {
        public UserSearchException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}