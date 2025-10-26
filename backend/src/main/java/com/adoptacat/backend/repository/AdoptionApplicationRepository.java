package com.adoptacat.backend.repository;

import com.adoptacat.backend.model.AdoptionApplication;
import com.adoptacat.backend.model.Cat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AdoptionApplicationRepository extends JpaRepository<AdoptionApplication, Long> {
    
    // Buscar por estado de la aplicación
    List<AdoptionApplication> findByStatus(AdoptionApplication.ApplicationStatus status);
    
    // Buscar por estado con paginación
    Page<AdoptionApplication> findByStatus(AdoptionApplication.ApplicationStatus status, Pageable pageable);
    
    // Buscar aplicaciones por gato
    List<AdoptionApplication> findByCat(Cat cat);
    
    // Buscar aplicaciones por gato y estado
    List<AdoptionApplication> findByCatAndStatus(Cat cat, AdoptionApplication.ApplicationStatus status);
    
    // Buscar por email del solicitante
    List<AdoptionApplication> findByEmailIgnoreCase(String email);
    
    // Buscar por número de aplicación
    Optional<AdoptionApplication> findByApplicationNumber(String applicationNumber);
    
    // Buscar por DNI del solicitante
    List<AdoptionApplication> findByDni(String dni);
    
    // Buscar aplicaciones de un solicitante específico
    @Query("SELECT a FROM AdoptionApplication a WHERE LOWER(a.fullName) = LOWER(:fullName) AND LOWER(a.email) = LOWER(:email)")
    List<AdoptionApplication> findByApplicantNameAndEmail(@Param("fullName") String fullName, @Param("email") String email);
    
    // Buscar aplicaciones por rango de fechas
    @Query("SELECT a FROM AdoptionApplication a WHERE a.createdAt BETWEEN :startDate AND :endDate")
    List<AdoptionApplication> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Buscar aplicaciones pendientes más antiguas
    @Query("SELECT a FROM AdoptionApplication a WHERE a.status = :status ORDER BY a.createdAt ASC")
    List<AdoptionApplication> findOldestPendingApplications(@Param("status") AdoptionApplication.ApplicationStatus status);
    
    // Contar aplicaciones por estado
    long countByStatus(AdoptionApplication.ApplicationStatus status);
    
    // Contar aplicaciones para un gato específico
    long countByCat(Cat cat);
    
    // Contar aplicaciones por gato y estado
    long countByCatAndStatus(Cat cat, AdoptionApplication.ApplicationStatus status);
    
    // Buscar aplicaciones por ciudad
    List<AdoptionApplication> findByCityIgnoreCase(String city);
    
    // Estadísticas de aplicaciones por mes
    @Query("SELECT MONTH(a.createdAt) as month, YEAR(a.createdAt) as year, COUNT(a) as count " +
           "FROM AdoptionApplication a " +
           "WHERE a.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY YEAR(a.createdAt), MONTH(a.createdAt) " +
           "ORDER BY YEAR(a.createdAt), MONTH(a.createdAt)")
    List<Object[]> getApplicationStatsByMonth(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Verificar si un usuario ya aplicó para un gato específico
    @Query("SELECT COUNT(a) > 0 FROM AdoptionApplication a WHERE a.cat = :cat AND LOWER(a.email) = LOWER(:email)")
    boolean hasUserAppliedForCat(@Param("cat") Cat cat, @Param("email") String email);
    
    // Buscar aplicaciones con recursos veterinarios
    List<AdoptionApplication> findByHasVetResourcesTrueAndStatus(AdoptionApplication.ApplicationStatus status);
    
    // Buscar aplicaciones que aceptan visitas
    List<AdoptionApplication> findByAcceptsVisitsTrueAndStatus(AdoptionApplication.ApplicationStatus status);
    
    // Aplicaciones que tienen experiencia previa con mascotas
    List<AdoptionApplication> findByHadPreviousPetsTrueAndStatus(AdoptionApplication.ApplicationStatus status);
    
    // Aplicaciones sin niños en casa
    List<AdoptionApplication> findByHasChildrenFalseAndStatus(AdoptionApplication.ApplicationStatus status);
    
    // Búsqueda completa con filtros múltiples
    @Query("SELECT a FROM AdoptionApplication a WHERE " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:hasVetResources IS NULL OR a.hasVetResources = :hasVetResources) AND " +
           "(:hasChildren IS NULL OR a.hasChildren = :hasChildren) AND " +
           "(:acceptsVisits IS NULL OR a.acceptsVisits = :acceptsVisits) AND " +
           "(:hadPreviousPets IS NULL OR a.hadPreviousPets = :hadPreviousPets) AND " +
           "(:city IS NULL OR LOWER(a.city) LIKE LOWER(CONCAT('%', :city, '%')))")
    Page<AdoptionApplication> findApplicationsWithFilters(
        @Param("status") AdoptionApplication.ApplicationStatus status,
        @Param("hasVetResources") Boolean hasVetResources,
        @Param("hasChildren") Boolean hasChildren,
        @Param("acceptsVisits") Boolean acceptsVisits,
        @Param("hadPreviousPets") Boolean hadPreviousPets,
        @Param("city") String city,
        Pageable pageable
    );
}