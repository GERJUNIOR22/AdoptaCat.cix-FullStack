package com.adoptacat.backend.repository;

import com.adoptacat.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad User
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // ============================================
    // BÚSQUEDAS BÁSICAS
    // ============================================

    /**
     * Buscar usuario por email
     */
    Optional<User> findByEmail(String email);

    /**
     * Verificar si existe un usuario con el email
     */
    boolean existsByEmail(String email);

    /**
     * Buscar usuarios por nombre completo (contiene texto)
     */
    List<User> findByFullNameContainingIgnoreCase(String fullName);

    /**
     * Buscar usuarios por rol
     */
    List<User> findByRole(User.Role role);

    /**
     * Buscar usuarios activos
     */
    List<User> findByIsActive(boolean isActive);

    /**
     * Buscar usuarios por rol y estado activo
     */
    List<User> findByRoleAndIsActive(User.Role role, boolean isActive);

    // ============================================
    // CONTADORES
    // ============================================

    /**
     * Contar usuarios por estado activo
     */
    long countByIsActive(boolean isActive);

    /**
     * Contar usuarios por rol
     */
    long countByRole(User.Role role);

    /**
     * Contar usuarios por rol y estado activo
     */
    long countByRoleAndIsActive(User.Role role, boolean isActive);

    /**
     * Contar usuarios con email verificado
     */
    long countByEmailVerified(boolean emailVerified);

    // ============================================
    // BÚSQUEDAS POR FECHA
    // ============================================

    /**
     * Buscar usuarios creados después de una fecha
     */
    List<User> findByCreatedAtAfter(LocalDateTime date);

    /**
     * Buscar usuarios creados entre dos fechas
     */
    List<User> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Buscar usuarios actualizados recientemente
     */
    List<User> findByUpdatedAtAfter(LocalDateTime date);

    // ============================================
    // BÚSQUEDAS AVANZADAS CON QUERY
    // ============================================

    /**
     * Buscar usuarios por múltiples criterios
     */
    @Query("SELECT u FROM User u WHERE " +
           "(:role IS NULL OR u.role = :role) AND " +
           "(:isActive IS NULL OR u.isActive = :isActive) AND " +
           "(:emailVerified IS NULL OR u.emailVerified = :emailVerified) AND " +
           "(:searchTerm IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           " LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<User> findUsersByCriteria(@Param("role") User.Role role,
                                  @Param("isActive") Boolean isActive,
                                  @Param("emailVerified") Boolean emailVerified,
                                  @Param("searchTerm") String searchTerm);

    /**
     * Obtener usuarios recientes (últimos N días)
     */
    @Query("SELECT u FROM User u WHERE u.createdAt >= :since ORDER BY u.createdAt DESC")
    List<User> findRecentUsers(@Param("since") LocalDateTime since);

    /**
     * Obtener administradores activos
     */
    @Query("SELECT u FROM User u WHERE u.role = 'ADMIN' AND u.isActive = true ORDER BY u.createdAt")
    List<User> findActiveAdmins();

    /**
     * Buscar usuarios por patrón de email
     */
    @Query("SELECT u FROM User u WHERE u.email LIKE %:emailPattern%")
    List<User> findByEmailPattern(@Param("emailPattern") String emailPattern);

    /**
     * Obtener estadísticas de usuarios por rol
     */
    @Query("SELECT u.role as role, COUNT(u) as count FROM User u GROUP BY u.role")
    List<UserRoleStats> getUserRoleStatistics();

    /**
     * Buscar usuarios inactivos por más de X días
     */
    @Query("SELECT u FROM User u WHERE u.updatedAt < :cutoffDate AND u.isActive = false")
    List<User> findInactiveUsersSince(@Param("cutoffDate") LocalDateTime cutoffDate);

    // ============================================
    // VERIFICACIONES DE SEGURIDAD
    // ============================================

    /**
     * Verificar si un usuario es administrador activo
     */
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u " +
           "WHERE u.email = :email AND u.role = 'ADMIN' AND u.isActive = true")
    boolean isActiveAdmin(@Param("email") String email);

    /**
     * Contar administradores activos (para validaciones de seguridad)
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = 'ADMIN' AND u.isActive = true")
    long countActiveAdmins();

    /**
     * Verificar si un usuario tiene acceso activo
     */
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u " +
           "WHERE u.email = :email AND u.isActive = true AND u.emailVerified = true")
    boolean hasActiveAccess(@Param("email") String email);

    // ============================================
    // INTERFACE PARA ESTADÍSTICAS
    // ============================================

    /**
     * Interface para estadísticas de roles de usuario
     */
    interface UserRoleStats {
        User.Role getRole();
        Long getCount();
    }
}