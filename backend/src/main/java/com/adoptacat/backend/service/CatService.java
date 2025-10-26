package com.adoptacat.backend.service;

import com.adoptacat.backend.model.Cat;
import com.adoptacat.backend.repository.CatRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
    
    @Autowired
    private CatRepository catRepository;
    
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
    public Page<Cat> searchCatsWithFilters(
            Cat.Gender gender,
            Cat.Size size,
            Cat.ActivityLevel activityLevel,
            Boolean isSpecialNeeds,
            Boolean isVaccinated,
            Boolean isSterilized,
            int page,
            int size1,
            String sortBy,
            String sortDirection) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size1, sort);
        
        return catRepository.findCatsWithFilters(
            gender, size, activityLevel, isSpecialNeeds, isVaccinated, isSterilized,
            Cat.AdoptionStatus.AVAILABLE, pageable
        );
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
        if (cat.getId() == null || cat.getId().trim().isEmpty()) {
            cat.setId(generateCatId());
        }
        
        // Validar que el ID no exista
        if (catRepository.existsById(cat.getId())) {
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
        
        return catRepository.save(cat);
    }
    
    // Actualizar gato
    public Cat updateCat(String id, Cat catDetails) {
        Optional<Cat> optionalCat = catRepository.findById(id);
        
        if (optionalCat.isEmpty()) {
            throw new IllegalArgumentException("No se encontró el gato con ID: " + id);
        }
        
        Cat existingCat = optionalCat.get();
        
        // Actualizar campos
        if (catDetails.getName() != null) existingCat.setName(catDetails.getName());
        if (catDetails.getBreed() != null) existingCat.setBreed(catDetails.getBreed());
        if (catDetails.getAge() != null) existingCat.setAge(catDetails.getAge());
        if (catDetails.getGender() != null) existingCat.setGender(catDetails.getGender());
        if (catDetails.getBirthDate() != null) existingCat.setBirthDate(catDetails.getBirthDate());
        if (catDetails.getSize() != null) existingCat.setSize(catDetails.getSize());
        if (catDetails.getMainImageUrl() != null) existingCat.setMainImageUrl(catDetails.getMainImageUrl());
        if (catDetails.getDescription() != null) existingCat.setDescription(catDetails.getDescription());
        if (catDetails.getStory() != null) existingCat.setStory(catDetails.getStory());
        if (catDetails.getPersonality() != null) existingCat.setPersonality(catDetails.getPersonality());
        if (catDetails.getHealthStatus() != null) existingCat.setHealthStatus(catDetails.getHealthStatus());
        if (catDetails.getIsVaccinated() != null) existingCat.setIsVaccinated(catDetails.getIsVaccinated());
        if (catDetails.getIsSterilized() != null) existingCat.setIsSterilized(catDetails.getIsSterilized());
        if (catDetails.getIsSpecialNeeds() != null) existingCat.setIsSpecialNeeds(catDetails.getIsSpecialNeeds());
        if (catDetails.getActivityLevel() != null) existingCat.setActivityLevel(catDetails.getActivityLevel());
        if (catDetails.getAdoptionStatus() != null) existingCat.setAdoptionStatus(catDetails.getAdoptionStatus());
        if (catDetails.getArrivedAt() != null) existingCat.setArrivedAt(catDetails.getArrivedAt());
        if (catDetails.getFeatured() != null) existingCat.setFeatured(catDetails.getFeatured());
        
        return catRepository.save(existingCat);
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
    
    // Método privado para generar ID del gato
    private String generateCatId() {
        String prefix = "CAT";
        long timestamp = System.currentTimeMillis();
        return prefix + timestamp;
    }
}