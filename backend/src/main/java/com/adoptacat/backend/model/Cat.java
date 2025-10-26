package com.adoptacat.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cats")
public class Cat {
    
    @Id
    private String id;
    
    @Column(nullable = false)
    @NotBlank
    private String name;
    
    private String breed;
    private String age;
    
    @Enumerated(EnumType.STRING)
    private Gender gender = Gender.UNKNOWN;
    
    @Column(name = "birth_date")
    private LocalDate birthDate;
    
    @Enumerated(EnumType.STRING)
    private Size size = Size.MEDIUM;
    
    @Column(name = "main_image_url")
    private String mainImageUrl;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "TEXT")
    private String story;
    
    @Column(columnDefinition = "TEXT")
    private String personality;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "health_status")
    private HealthStatus healthStatus = HealthStatus.HEALTHY;
    
    @Column(name = "is_vaccinated")
    private Boolean isVaccinated = false;
    
    @Column(name = "is_sterilized")
    private Boolean isSterilized = false;
    
    @Column(name = "is_special_needs")
    private Boolean isSpecialNeeds = false;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "activity_level")
    private ActivityLevel activityLevel = ActivityLevel.MEDIUM;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "adoption_status")
    private AdoptionStatus adoptionStatus = AdoptionStatus.AVAILABLE;
    
    @Column(name = "arrived_at")
    private LocalDate arrivedAt;
    
    @Column(name = "adopted_at")
    private LocalDate adoptedAt;
    
    private Boolean featured = false;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relaciones
    @OneToMany(mappedBy = "cat", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CatImage> images = new ArrayList<>();
    
    @OneToMany(mappedBy = "cat", cascade = CascadeType.ALL)
    private List<AdoptionApplication> adoptionApplications = new ArrayList<>();
    
    @OneToMany(mappedBy = "cat", cascade = CascadeType.ALL)
    private List<VeterinaryExpense> veterinaryExpenses = new ArrayList<>();
    
    @OneToMany(mappedBy = "cat", cascade = CascadeType.ALL)
    private List<Adoption> adoptions = new ArrayList<>();
    
    // Constructors
    public Cat() {}
    
    public Cat(String id, String name, String breed, String age) {
        this.id = id;
        this.name = name;
        this.breed = breed;
        this.age = age;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getBreed() { return breed; }
    public void setBreed(String breed) { this.breed = breed; }
    
    public String getAge() { return age; }
    public void setAge(String age) { this.age = age; }
    
    public Gender getGender() { return gender; }
    public void setGender(Gender gender) { this.gender = gender; }
    
    public LocalDate getBirthDate() { return birthDate; }
    public void setBirthDate(LocalDate birthDate) { this.birthDate = birthDate; }
    
    public Size getSize() { return size; }
    public void setSize(Size size) { this.size = size; }
    
    public String getMainImageUrl() { return mainImageUrl; }
    public void setMainImageUrl(String mainImageUrl) { this.mainImageUrl = mainImageUrl; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getStory() { return story; }
    public void setStory(String story) { this.story = story; }
    
    public String getPersonality() { return personality; }
    public void setPersonality(String personality) { this.personality = personality; }
    
    public HealthStatus getHealthStatus() { return healthStatus; }
    public void setHealthStatus(HealthStatus healthStatus) { this.healthStatus = healthStatus; }
    
    public Boolean getIsVaccinated() { return isVaccinated; }
    public void setIsVaccinated(Boolean isVaccinated) { this.isVaccinated = isVaccinated; }
    
    public Boolean getIsSterilized() { return isSterilized; }
    public void setIsSterilized(Boolean isSterilized) { this.isSterilized = isSterilized; }
    
    public Boolean getIsSpecialNeeds() { return isSpecialNeeds; }
    public void setIsSpecialNeeds(Boolean isSpecialNeeds) { this.isSpecialNeeds = isSpecialNeeds; }
    
    public ActivityLevel getActivityLevel() { return activityLevel; }
    public void setActivityLevel(ActivityLevel activityLevel) { this.activityLevel = activityLevel; }
    
    public AdoptionStatus getAdoptionStatus() { return adoptionStatus; }
    public void setAdoptionStatus(AdoptionStatus adoptionStatus) { this.adoptionStatus = adoptionStatus; }
    
    public LocalDate getArrivedAt() { return arrivedAt; }
    public void setArrivedAt(LocalDate arrivedAt) { this.arrivedAt = arrivedAt; }
    
    public LocalDate getAdoptedAt() { return adoptedAt; }
    public void setAdoptedAt(LocalDate adoptedAt) { this.adoptedAt = adoptedAt; }
    
    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public List<CatImage> getImages() { return images; }
    public void setImages(List<CatImage> images) { this.images = images; }
    
    public List<AdoptionApplication> getAdoptionApplications() { return adoptionApplications; }
    public void setAdoptionApplications(List<AdoptionApplication> adoptionApplications) { this.adoptionApplications = adoptionApplications; }
    
    public List<VeterinaryExpense> getVeterinaryExpenses() { return veterinaryExpenses; }
    public void setVeterinaryExpenses(List<VeterinaryExpense> veterinaryExpenses) { this.veterinaryExpenses = veterinaryExpenses; }
    
    public List<Adoption> getAdoptions() { return adoptions; }
    public void setAdoptions(List<Adoption> adoptions) { this.adoptions = adoptions; }
    
    // Enums
    public enum Gender {
        MALE, FEMALE, UNKNOWN
    }
    
    public enum Size {
        SMALL, MEDIUM, LARGE
    }
    
    public enum HealthStatus {
        HEALTHY, SPECIAL_NEEDS, RECOVERING, CRITICAL
    }
    
    public enum ActivityLevel {
        LOW, MEDIUM, HIGH
    }
    
    public enum AdoptionStatus {
        AVAILABLE, PENDING, ADOPTED, UNAVAILABLE
    }
}