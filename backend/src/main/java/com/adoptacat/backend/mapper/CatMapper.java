package com.adoptacat.backend.mapper;

import com.adoptacat.backend.dto.CatDTO;
import com.adoptacat.backend.model.Cat;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CatMapper {
    
    public CatDTO toDTO(Cat cat) {
        if (cat == null) {
            return null;
        }
        
        CatDTO dto = new CatDTO();
        dto.setId(cat.getId());
        dto.setName(cat.getName());
        dto.setAge(cat.getAge());
        dto.setBreed(cat.getBreed());
        dto.setMainImage(cat.getMainImageUrl());
        
        // Convertir gallery de la relación CatImage a List<String>
        if (cat.getImages() != null && !cat.getImages().isEmpty()) {
            List<String> gallery = cat.getImages().stream()
                .map(catImage -> catImage.getImageUrl())
                .collect(Collectors.toList());
            dto.setGallery(gallery);
        }
        
        // Convertir personality de String a List<String>
        if (cat.getPersonality() != null && !cat.getPersonality().trim().isEmpty()) {
            List<String> personality = Arrays.asList(cat.getPersonality().split(","));
            dto.setPersonality(personality.stream()
                .map(String::trim)
                .collect(Collectors.toList()));
        }
        
        dto.setStory(cat.getStory());
        dto.setDescription(cat.getDescription());
        dto.setIsSpecialNeeds(cat.getIsSpecialNeeds());
        dto.setVaccinated(cat.getIsVaccinated());
        dto.setSterilized(cat.getIsSterilized());
        dto.setGender(cat.getGender() != null ? cat.getGender().name().toLowerCase() : null);
        
        // Características adicionales
        dto.setBirthDate(cat.getBirthDate());
        dto.setSize(cat.getSize() != null ? cat.getSize().name().toLowerCase() : null);
        dto.setActivityLevel(cat.getActivityLevel() != null ? cat.getActivityLevel().name().toLowerCase() : null);
        dto.setHealthStatus(cat.getHealthStatus() != null ? cat.getHealthStatus().name().toLowerCase() : null);
        dto.setArrivedAt(cat.getArrivedAt());
        dto.setIsAvailable(cat.getAdoptionStatus() == Cat.AdoptionStatus.AVAILABLE);
        dto.setFeatured(cat.getFeatured());
        
        // Proceso de adopción (datos estáticos basados en el frontend)
        dto.setAdoptionProcess(getStandardAdoptionProcess());
        
        return dto;
    }
    
    public Cat toEntity(CatDTO dto) {
        if (dto == null) {
            return null;
        }
        
        Cat cat = new Cat();
        cat.setId(dto.getId());
        cat.setName(dto.getName());
        cat.setAge(dto.getAge());
        cat.setBreed(dto.getBreed());
        cat.setMainImageUrl(dto.getMainImage());
        
        // Convertir personality de List<String> a String
        if (dto.getPersonality() != null && !dto.getPersonality().isEmpty()) {
            String personality = String.join(", ", dto.getPersonality());
            cat.setPersonality(personality);
        }
        
        cat.setStory(dto.getStory());
        cat.setDescription(dto.getDescription());
        cat.setIsSpecialNeeds(dto.getIsSpecialNeeds());
        cat.setIsVaccinated(dto.getVaccinated());
        cat.setIsSterilized(dto.getSterilized());
        
        // Convertir enums
        if (dto.getGender() != null) {
            cat.setGender(Cat.Gender.valueOf(dto.getGender().toUpperCase()));
        }
        if (dto.getSize() != null) {
            cat.setSize(Cat.Size.valueOf(dto.getSize().toUpperCase()));
        }
        if (dto.getActivityLevel() != null) {
            cat.setActivityLevel(Cat.ActivityLevel.valueOf(dto.getActivityLevel().toUpperCase()));
        }
        if (dto.getHealthStatus() != null) {
            cat.setHealthStatus(Cat.HealthStatus.valueOf(dto.getHealthStatus().toUpperCase()));
        }
        
        cat.setBirthDate(dto.getBirthDate());
        cat.setArrivedAt(dto.getArrivedAt());
        cat.setFeatured(dto.getFeatured());
        
        // Establecer estado de adopción
        if (dto.getIsAvailable() != null) {
            cat.setAdoptionStatus(dto.getIsAvailable() ? 
                Cat.AdoptionStatus.AVAILABLE : Cat.AdoptionStatus.UNAVAILABLE);
        }
        
        return cat;
    }
    
    public List<CatDTO> toDTOList(List<Cat> cats) {
        if (cats == null) {
            return null;
        }
        return cats.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public List<Cat> toEntityList(List<CatDTO> dtos) {
        if (dtos == null) {
            return null;
        }
        return dtos.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }
    
    // Método privado para obtener el proceso de adopción estándar
    private List<CatDTO.AdoptionStepDTO> getStandardAdoptionProcess() {
        return Arrays.asList(
            new CatDTO.AdoptionStepDTO(1, "Solicitud", 
                "Completa el formulario de adopción con toda tu información", "#f97316"),
            new CatDTO.AdoptionStepDTO(2, "Revisión", 
                "Nuestro equipo revisará tu solicitud y te contactará", "#06b6d4"),
            new CatDTO.AdoptionStepDTO(3, "Entrevista", 
                "Realizaremos una entrevista para conocerte mejor", "#8b5cf6"),
            new CatDTO.AdoptionStepDTO(4, "Visita", 
                "Visitaremos tu hogar para verificar las condiciones", "#10b981"),
            new CatDTO.AdoptionStepDTO(5, "Adopción", 
                "¡Bienvenido a la familia AdoptaCat!", "#f59e0b")
        );
    }
}