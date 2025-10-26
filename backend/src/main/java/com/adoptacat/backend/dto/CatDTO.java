package com.adoptacat.backend.dto;

import java.time.LocalDate;
import java.util.List;

public class CatDTO {
    private String id;
    private String name;
    private String age;
    private String breed;
    private String mainImage;
    private List<String> gallery;
    private List<String> personality;
    private String story;
    private String description;
    private Boolean isSpecialNeeds;
    private Boolean vaccinated;
    private Boolean sterilized;
    private String gender;
    
    // Características adicionales para DetailedCat
    private LocalDate birthDate;
    private String size;
    private String activityLevel;
    private String healthStatus;
    private LocalDate arrivedAt;
    private Boolean isAvailable;
    private Boolean featured;
    
    // Proceso de adopción (para DetailedCat)
    private List<AdoptionStepDTO> adoptionProcess;
    
    // Constructors
    public CatDTO() {}
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getAge() { return age; }
    public void setAge(String age) { this.age = age; }
    
    public String getBreed() { return breed; }
    public void setBreed(String breed) { this.breed = breed; }
    
    public String getMainImage() { return mainImage; }
    public void setMainImage(String mainImage) { this.mainImage = mainImage; }
    
    public List<String> getGallery() { return gallery; }
    public void setGallery(List<String> gallery) { this.gallery = gallery; }
    
    public List<String> getPersonality() { return personality; }
    public void setPersonality(List<String> personality) { this.personality = personality; }
    
    public String getStory() { return story; }
    public void setStory(String story) { this.story = story; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Boolean getIsSpecialNeeds() { return isSpecialNeeds; }
    public void setIsSpecialNeeds(Boolean isSpecialNeeds) { this.isSpecialNeeds = isSpecialNeeds; }
    
    public Boolean getVaccinated() { return vaccinated; }
    public void setVaccinated(Boolean vaccinated) { this.vaccinated = vaccinated; }
    
    public Boolean getSterilized() { return sterilized; }
    public void setSterilized(Boolean sterilized) { this.sterilized = sterilized; }
    
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    
    public LocalDate getBirthDate() { return birthDate; }
    public void setBirthDate(LocalDate birthDate) { this.birthDate = birthDate; }
    
    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
    
    public String getActivityLevel() { return activityLevel; }
    public void setActivityLevel(String activityLevel) { this.activityLevel = activityLevel; }
    
    public String getHealthStatus() { return healthStatus; }
    public void setHealthStatus(String healthStatus) { this.healthStatus = healthStatus; }
    
    public LocalDate getArrivedAt() { return arrivedAt; }
    public void setArrivedAt(LocalDate arrivedAt) { this.arrivedAt = arrivedAt; }
    
    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
    
    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }
    
    public List<AdoptionStepDTO> getAdoptionProcess() { return adoptionProcess; }
    public void setAdoptionProcess(List<AdoptionStepDTO> adoptionProcess) { this.adoptionProcess = adoptionProcess; }
    
    // Clase interna para los pasos del proceso de adopción
    public static class AdoptionStepDTO {
        private int step;
        private String title;
        private String description;
        private String color;
        
        public AdoptionStepDTO(int step, String title, String description, String color) {
            this.step = step;
            this.title = title;
            this.description = description;
            this.color = color;
        }
        
        // Getters and Setters
        public int getStep() { return step; }
        public void setStep(int step) { this.step = step; }
        
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
    }
}