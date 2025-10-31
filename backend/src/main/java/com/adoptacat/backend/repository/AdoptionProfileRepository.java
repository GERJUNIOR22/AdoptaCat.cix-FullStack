package com.adoptacat.backend.repository;

import com.adoptacat.backend.model.AdoptionProfile;
import com.adoptacat.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdoptionProfileRepository extends JpaRepository<AdoptionProfile, Long> {
    
    /**
     * Buscar perfil por usuario
     */
    Optional<AdoptionProfile> findByUser(User user);
    
    /**
     * Buscar perfil por email del usuario
     */
    @Query("SELECT ap FROM AdoptionProfile ap WHERE ap.correoElectronico = :email")
    Optional<AdoptionProfile> findByEmail(@Param("email") String email);
    
    /**
     * Buscar perfiles por status
     */
    List<AdoptionProfile> findByStatus(AdoptionProfile.ProfileStatus status);
    
    /**
     * Buscar perfiles pendientes de revisión
     */
    @Query("SELECT ap FROM AdoptionProfile ap WHERE ap.status IN (:statuses)")
    List<AdoptionProfile> findPendingProfiles(@Param("statuses") List<AdoptionProfile.ProfileStatus> statuses);
    
    /**
     * Verificar si existe perfil para un usuario
     */
    boolean existsByUser(User user);
    
    /**
     * Verificar si existe perfil por email
     */
    boolean existsByCorreoElectronico(String email);
    
    /**
     * Buscar perfiles por DNI
     */
    Optional<AdoptionProfile> findByDni(String dni);
    
    /**
     * Buscar perfiles por nombre completo (búsqueda parcial)
     */
    @Query("SELECT ap FROM AdoptionProfile ap WHERE LOWER(ap.nombreCompleto) LIKE LOWER(CONCAT('%', :nombre, '%'))")
    List<AdoptionProfile> findByNombreCompletoContainingIgnoreCase(@Param("nombre") String nombre);
    
    /**
     * Contar perfiles por status
     */
    @Query("SELECT COUNT(ap) FROM AdoptionProfile ap WHERE ap.status = :status")
    long countByStatus(@Param("status") AdoptionProfile.ProfileStatus status);
    
    /**
     * Buscar perfiles por ciudad
     */
    List<AdoptionProfile> findByCiudadIgnoreCase(String ciudad);
    
    /**
     * Buscar perfiles aprobados que tienen mascotas actuales
     */
    @Query("SELECT ap FROM AdoptionProfile ap WHERE ap.status = :status AND ap.tieneMascotasActuales = true")
    List<AdoptionProfile> findApprovedProfilesWithCurrentPets(@Param("status") AdoptionProfile.ProfileStatus status);
}