package com.adoptacat.backend.repository;

import com.adoptacat.backend.model.Cat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CatRepository extends JpaRepository<Cat, String> {

        // Buscar gatos disponibles para adopción
        List<Cat> findByAdoptionStatus(Cat.AdoptionStatus status);

        // Buscar gatos disponibles con paginación
        Page<Cat> findByAdoptionStatus(Cat.AdoptionStatus status, Pageable pageable);

        // Buscar gatos destacados
        List<Cat> findByFeaturedTrueAndAdoptionStatus(Cat.AdoptionStatus status);

        // Buscar por género
        List<Cat> findByGenderAndAdoptionStatus(Cat.Gender gender, Cat.AdoptionStatus status);

        // Buscar por tamaño
        List<Cat> findBySizeAndAdoptionStatus(Cat.Size size, Cat.AdoptionStatus status);

        // Buscar por nivel de actividad
        List<Cat> findByActivityLevelAndAdoptionStatus(Cat.ActivityLevel activityLevel, Cat.AdoptionStatus status);

        // Buscar por necesidades especiales
        List<Cat> findByIsSpecialNeedsAndAdoptionStatus(Boolean isSpecialNeeds, Cat.AdoptionStatus status);

        // Buscar por estado de vacunación
        List<Cat> findByIsVaccinatedAndAdoptionStatus(Boolean isVaccinated, Cat.AdoptionStatus status);

        // Buscar por estado de esterilización
        List<Cat> findByIsSterilizedAndAdoptionStatus(Boolean isSterilized, Cat.AdoptionStatus status);

        // Búsqueda por nombre
        @Query("SELECT c FROM Cat c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%')) AND c.adoptionStatus = :status")
        List<Cat> findByNameContainingIgnoreCaseAndAdoptionStatus(@Param("name") String name,
                        @Param("status") Cat.AdoptionStatus status);

        // Búsqueda por raza
        @Query("SELECT c FROM Cat c WHERE LOWER(c.breed) LIKE LOWER(CONCAT('%', :breed, '%')) AND c.adoptionStatus = :status")
        List<Cat> findByBreedContainingIgnoreCaseAndAdoptionStatus(@Param("breed") String breed,
                        @Param("status") Cat.AdoptionStatus status);

        // Búsqueda completa con filtros múltiples - CORREGIDO
        @Query("SELECT c FROM Cat c WHERE " +
                        "(:gender IS NULL OR c.gender = :gender) AND " +
                        "(:size IS NULL OR c.size = :size) AND " +
                        "(:isVaccinated IS NULL OR c.isVaccinated = :isVaccinated) AND " +
                        "(:isSterilized IS NULL OR c.isSterilized = :isSterilized) AND " +
                        "(:isSpecialNeeds IS NULL OR c.isSpecialNeeds = :isSpecialNeeds) AND " +
                        "c.adoptionStatus = :status")
        Page<Cat> findCatsWithFilters(
                        @Param("gender") Cat.Gender gender,
                        @Param("size") Cat.Size size,
                        @Param("isVaccinated") Boolean isVaccinated,
                        @Param("isSterilized") Boolean isSterilized,
                        @Param("isSpecialNeeds") Boolean isSpecialNeeds,
                        @Param("status") Cat.AdoptionStatus status,
                        Pageable pageable);

        // Contar gatos por estado
        long countByAdoptionStatus(Cat.AdoptionStatus status);

        // Gatos recién llegados (últimos 30 días)
        @Query("SELECT c FROM Cat c WHERE c.arrivedAt >= :date AND c.adoptionStatus = :status ORDER BY c.arrivedAt DESC")
        List<Cat> findRecentArrivals(@Param("date") java.time.LocalDate date,
                        @Param("status") Cat.AdoptionStatus status);

        // Buscar gato por ID y que esté disponible
        Optional<Cat> findByIdAndAdoptionStatus(String id, Cat.AdoptionStatus status);
}