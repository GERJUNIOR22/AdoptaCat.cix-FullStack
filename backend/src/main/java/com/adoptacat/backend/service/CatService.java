
package com.adoptacat.backend.service;

import com.adoptacat.backend.model.Cat;
import com.adoptacat.backend.repository.CatRepository;
import com.adoptacat.backend.util.AdoptaCatUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CatService {

    private static final Logger logger = LoggerFactory.getLogger(CatService.class);

    private final CatRepository catRepository;
    private final AdoptaCatUtils utils;

    public CatService(CatRepository catRepository, AdoptaCatUtils utils) {
        this.catRepository = catRepository;
        this.utils = utils;
    }

    // Obtener todos los gatos disponibles
    public List<Cat> getAllAvailableCats() {
        return catRepository.findByAdoptionStatus(Cat.AdoptionStatus.AVAILABLE);
    }

    // Obtener gatos disponibles con paginación
    public Page<Cat> getAvailableCats(int page, int size, String sortBy, String sortDirection) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return catRepository.findByAdoptionStatus(Cat.AdoptionStatus.AVAILABLE, pageable);
    }

    // Obtener gato por ID
    public Optional<Cat> getCatById(String id) {
        return catRepository.findById(id);
    }

    // Obtener gato disponible por ID
    public Optional<Cat> getAvailableCatById(String id) {
        return catRepository.findByIdAndAdoptionStatus(id, Cat.AdoptionStatus.AVAILABLE);
    }

    // Obtener gatos destacados
    public List<Cat> getFeaturedCats() {
        return catRepository.findByFeaturedTrueAndAdoptionStatus(Cat.AdoptionStatus.AVAILABLE);
    }

    // Obtener gatos recién llegados (últimos 30 días)
    public List<Cat> getRecentArrivals() {
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        return catRepository.findRecentArrivals(thirtyDaysAgo, Cat.AdoptionStatus.AVAILABLE);
    }

    // Buscar gatos con filtros
    public Page<Cat> searchCatsWithFilters(CatSearchFilters filters,
            int page, int size, String sortBy, String sortDirection) {

        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        return catRepository.findCatsWithFilters(
                filters.getGender(), filters.getSize(), filters.getActivityLevel(),
                filters.getIsSpecialNeeds(), filters.getIsVaccinated(), filters.getIsSterilized(),
                Cat.AdoptionStatus.AVAILABLE, pageable);
    }

    // Buscar gatos por nombre
    public List<Cat> searchCatsByName(String name) {
        return catRepository.findByNameContainingIgnoreCaseAndAdoptionStatus(name, Cat.AdoptionStatus.AVAILABLE);
    }

    // Buscar gatos por raza
    public List<Cat> searchCatsByBreed(String breed) {
        return catRepository.findByBreedContainingIgnoreCaseAndAdoptionStatus(breed, Cat.AdoptionStatus.AVAILABLE);
    }

    // Crear nuevo gato
    public Cat createCat(Cat cat) {
        logger.info("Creando nuevo gato: {}", cat.getName());

        // Validar y sanitizar datos
        if (cat.getName() != null) {
            cat.setName(utils.validateAndSanitizeName(cat.getName()));
        }

        if (cat.getDescription() != null) {
            cat.setDescription(utils.validateAndSanitizeText(cat.getDescription()));
        }

        if (cat.getStory() != null) {
            cat.setStory(utils.validateAndSanitizeText(cat.getStory()));
        }

        if (cat.getId() == null || cat.getId().trim().isEmpty()) {
            cat.setId(utils.generateCatId());
        }

        // Validar que el ID sea alfanumérico
        if (!utils.isValidAlphanumericId(cat.getId())) {
            logger.warn("Intento de crear gato con ID inválido: {}", cat.getId());
            throw new IllegalArgumentException("El ID del gato debe ser alfanumérico");
        }

        // Validar que el ID no exista
        if (catRepository.existsById(cat.getId())) {
            logger.warn("Intento de crear gato con ID duplicado: {}", cat.getId());
            throw new IllegalArgumentException("Ya existe un gato con el ID: " + cat.getId());
        }

        // Establecer valores por defecto
        if (cat.getAdoptionStatus() == null) {
            cat.setAdoptionStatus(Cat.AdoptionStatus.AVAILABLE);
        }
        if (cat.getFeatured() == null) {
            cat.setFeatured(false);
        }
        if (cat.getIsVaccinated() == null) {
            cat.setIsVaccinated(false);
        }
        if (cat.getIsSterilized() == null) {
            cat.setIsSterilized(false);
        }
        if (cat.getIsSpecialNeeds() == null) {
            cat.setIsSpecialNeeds(false);
        }

        Cat savedCat = catRepository.save(cat);

        utils.logAuditAction("CREATE_CAT", "ADMIN",
                "Gato creado: " + savedCat.getId() + " - " + savedCat.getName());

        logger.info("Gato creado exitosamente: {} - {}", savedCat.getId(), savedCat.getName());

        return savedCat;
    }

    // Actualizar gato
    public Cat updateCat(String id, Cat catDetails) {
        Optional<Cat> optionalCat = catRepository.findById(id);

        if (optionalCat.isEmpty()) {
            throw new IllegalArgumentException("No se encontró el gato con ID: " + id);
        }

        Cat existingCat = optionalCat.get();

        updateBasicInfo(existingCat, catDetails);
        updateHealthInfo(existingCat, catDetails);
        updateStatusInfo(existingCat, catDetails);

        return catRepository.save(existingCat);
    }

    private void updateBasicInfo(Cat existingCat, Cat catDetails) {
        if (catDetails.getName() != null)
            existingCat.setName(catDetails.getName());
        if (catDetails.getBreed() != null)
            existingCat.setBreed(catDetails.getBreed());
        if (catDetails.getAge() != null)
            existingCat.setAge(catDetails.getAge());
        if (catDetails.getGender() != null)
            existingCat.setGender(catDetails.getGender());
        if (catDetails.getBirthDate() != null)
            existingCat.setBirthDate(catDetails.getBirthDate());
        if (catDetails.getSize() != null)
            existingCat.setSize(catDetails.getSize());
        if (catDetails.getMainImageUrl() != null)
            existingCat.setMainImageUrl(catDetails.getMainImageUrl());
        if (catDetails.getDescription() != null)
            existingCat.setDescription(catDetails.getDescription());
        if (catDetails.getStory() != null)
            existingCat.setStory(catDetails.getStory());
        if (catDetails.getPersonality() != null)
            existingCat.setPersonality(catDetails.getPersonality());
    }

    private void updateHealthInfo(Cat existingCat, Cat catDetails) {
        if (catDetails.getHealthStatus() != null)
            existingCat.setHealthStatus(catDetails.getHealthStatus());
        if (catDetails.getIsVaccinated() != null)
            existingCat.setIsVaccinated(catDetails.getIsVaccinated());
        if (catDetails.getIsSterilized() != null)
            existingCat.setIsSterilized(catDetails.getIsSterilized());
        if (catDetails.getIsSpecialNeeds() != null)
            existingCat.setIsSpecialNeeds(catDetails.getIsSpecialNeeds());
        if (catDetails.getActivityLevel() != null)
            existingCat.setActivityLevel(catDetails.getActivityLevel());
    }

    private void updateStatusInfo(Cat existingCat, Cat catDetails) {
        if (catDetails.getAdoptionStatus() != null)
            existingCat.setAdoptionStatus(catDetails.getAdoptionStatus());
        if (catDetails.getArrivedAt() != null)
            existingCat.setArrivedAt(catDetails.getArrivedAt());
        if (catDetails.getFeatured() != null)
            existingCat.setFeatured(catDetails.getFeatured());
    }

    // Marcar gato como adoptado
    public Cat markAsAdopted(String id) {
        Optional<Cat> optionalCat = catRepository.findById(id);

        if (optionalCat.isEmpty()) {
            throw new IllegalArgumentException("No se encontró el gato con ID: " + id);
        }

        Cat cat = optionalCat.get();
        cat.setAdoptionStatus(Cat.AdoptionStatus.ADOPTED);
        cat.setAdoptedAt(LocalDate.now());

        return catRepository.save(cat);
    }

    // Marcar gato como disponible
    public Cat markAsAvailable(String id) {
        Optional<Cat> optionalCat = catRepository.findById(id);

        if (optionalCat.isEmpty()) {
            throw new IllegalArgumentException("No se encontró el gato con ID: " + id);
        }

        Cat cat = optionalCat.get();
        cat.setAdoptionStatus(Cat.AdoptionStatus.AVAILABLE);
        cat.setAdoptedAt(null);

        return catRepository.save(cat);
    }

    // Eliminar gato
    public void deleteCat(String id) {
        if (!catRepository.existsById(id)) {
            throw new IllegalArgumentException("No se encontró el gato con ID: " + id);
        }
        catRepository.deleteById(id);
    }

    // Estadísticas
    public long countAvailableCats() {
        return catRepository.countByAdoptionStatus(Cat.AdoptionStatus.AVAILABLE);
    }

    public long countAdoptedCats() {
        return catRepository.countByAdoptionStatus(Cat.AdoptionStatus.ADOPTED);
    }

    public long countPendingCats() {
        return catRepository.countByAdoptionStatus(Cat.AdoptionStatus.PENDING);
    }

    // Verificar si existe un gato
    public boolean existsById(String id) {
        return catRepository.existsById(id);
    }

    // ============================================
    // MÉTODOS PARA ADMINISTRACIÓN
    // ============================================

    /**
     * Obtener todos los gatos para administración (incluye no disponibles)
     */
    public Page<Cat> getAllCatsForAdmin(int page, int size, String sortBy, String sortDirection,
            Cat.AdoptionStatus status) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        if (status != null) {
            return catRepository.findByAdoptionStatus(status, pageable);
        } else {
            return catRepository.findAll(pageable);
        }
    }

    /**
     * Contar todos los gatos
     */
    public long countAllCats() {
        return catRepository.count();
    }

    /**
     * Obtener gatos agregados recientemente
     */
    public List<Cat> getRecentlyAddedCats(int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by("createdAt").descending());
        return catRepository.findAll(pageable).getContent();
    }

    /**
     * Actualizar estado de gatos en lote
     */
    public void batchUpdateStatus(List<String> catIds, Cat.AdoptionStatus status) {
        try {
            for (String catId : catIds) {
                Optional<Cat> catOpt = catRepository.findById(catId);
                if (catOpt.isPresent()) {
                    Cat cat = catOpt.get();
                    cat.setAdoptionStatus(status);
                    if (status == Cat.AdoptionStatus.ADOPTED) {
                        cat.setAdoptedAt(LocalDate.now());
                    } else if (status == Cat.AdoptionStatus.AVAILABLE) {
                        cat.setAdoptedAt(null);
                    }
                    catRepository.save(cat);
                }
            }

            utils.logAuditAction("BATCH_CAT_STATUS_UPDATE", "ADMIN",
                    String.format("Actualizados %d gatos a estado %s", catIds.size(), status));

        } catch (Exception e) { // NOSONAR - Exception is logged and rethrown with context
            logger.error("Error en actualización masiva de {} gatos a estado {}: {}",
                    catIds.size(), status, e.getMessage(), e);
            throw new CatServiceException("Error en actualización masiva", e);
        }
    }

    /**
     * Excepción personalizada para el servicio de gatos
     */
    public static class CatServiceException extends RuntimeException {
        public CatServiceException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    /**
     * Clase para encapsular filtros de búsqueda de gatos
     */
    public static class CatSearchFilters {
        private Cat.Gender gender;
        private Cat.Size size;
        private Cat.ActivityLevel activityLevel;
        private Boolean isSpecialNeeds;
        private Boolean isVaccinated;
        private Boolean isSterilized;

        public CatSearchFilters(Cat.Gender gender, Cat.Size size, Cat.ActivityLevel activityLevel,
                Boolean isSpecialNeeds, Boolean isVaccinated, Boolean isSterilized) {
            this.gender = gender;
            this.size = size;
            this.activityLevel = activityLevel;
            this.isSpecialNeeds = isSpecialNeeds;
            this.isVaccinated = isVaccinated;
            this.isSterilized = isSterilized;
        }

        public Cat.Gender getGender() {
            return gender;
        }

        public Cat.Size getSize() {
            return size;
        }

        public Cat.ActivityLevel getActivityLevel() {
            return activityLevel;
        }

        public Boolean getIsSpecialNeeds() {
            return isSpecialNeeds;
        }

        public Boolean getIsVaccinated() {
            return isVaccinated;
        }

        public Boolean getIsSterilized() {
            return isSterilized;
        }
    }
}