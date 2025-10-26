package com.adoptacat.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class AdoptionApplicationDTO {
    private Long id;
    
    @NotBlank(message = "El ID del gato es obligatorio")
    private String catId;
    
    private String applicationNumber;
    
    // Información del candidato
    @NotBlank(message = "El nombre completo es obligatorio")
    private String fullName;
    
    private String phone;
    private LocalDate birthDate;
    private String city;
    private String dni;
    private String civilStatus;
    private String occupation;
    private String address;
    private String district;
    
    @Email(message = "El email debe tener un formato válido")
    @NotBlank(message = "El email es obligatorio")
    private String email;
    
    private String instagram;
    private String facebook;
    
    // Experiencia con mascotas
    private String whyAdopt;
    private Boolean hasCurrentPets;
    private String currentPetsDetails;
    private Boolean hadPreviousPets;
    private String previousPetsDetails;
    private String petsWhereAreNow;
    private Boolean petsSterilized;
    private String sterilizationReason;
    
    // Hogar
    private Boolean hasChildren;
    private String childrenAges;
    private String householdSize;
    private Boolean allAgree;
    private Boolean anyAllergies;
    private String livingType;
    private String movingPlans;
    
    // Recreación y proyección
    private Boolean hasSpace;
    private String accessAreas;
    private String sleepingPlace;
    private Boolean hasEscapeSpaces;
    private String behaviorIssuesResponse;
    
    // Cuidados y gastos
    private String whoPaysExpenses;
    private Boolean hasVetResources;
    private List<String> careCommitments;
    private Boolean sterilizeCommitment;
    private Boolean acceptsVisits;
    
    @NotNull(message = "Debe aceptar los términos y condiciones")
    private Boolean acceptsTerms;
    
    // Estado de la solicitud
    private String status;
    private String adminNotes;
    private LocalDateTime reviewDate;
    private String reviewedBy;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public AdoptionApplicationDTO() {}
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getCatId() { return catId; }
    public void setCatId(String catId) { this.catId = catId; }
    
    public String getApplicationNumber() { return applicationNumber; }
    public void setApplicationNumber(String applicationNumber) { this.applicationNumber = applicationNumber; }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public LocalDate getBirthDate() { return birthDate; }
    public void setBirthDate(LocalDate birthDate) { this.birthDate = birthDate; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getDni() { return dni; }
    public void setDni(String dni) { this.dni = dni; }
    
    public String getCivilStatus() { return civilStatus; }
    public void setCivilStatus(String civilStatus) { this.civilStatus = civilStatus; }
    
    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getInstagram() { return instagram; }
    public void setInstagram(String instagram) { this.instagram = instagram; }
    
    public String getFacebook() { return facebook; }
    public void setFacebook(String facebook) { this.facebook = facebook; }
    
    public String getWhyAdopt() { return whyAdopt; }
    public void setWhyAdopt(String whyAdopt) { this.whyAdopt = whyAdopt; }
    
    public Boolean getHasCurrentPets() { return hasCurrentPets; }
    public void setHasCurrentPets(Boolean hasCurrentPets) { this.hasCurrentPets = hasCurrentPets; }
    
    public String getCurrentPetsDetails() { return currentPetsDetails; }
    public void setCurrentPetsDetails(String currentPetsDetails) { this.currentPetsDetails = currentPetsDetails; }
    
    public Boolean getHadPreviousPets() { return hadPreviousPets; }
    public void setHadPreviousPets(Boolean hadPreviousPets) { this.hadPreviousPets = hadPreviousPets; }
    
    public String getPreviousPetsDetails() { return previousPetsDetails; }
    public void setPreviousPetsDetails(String previousPetsDetails) { this.previousPetsDetails = previousPetsDetails; }
    
    public String getPetsWhereAreNow() { return petsWhereAreNow; }
    public void setPetsWhereAreNow(String petsWhereAreNow) { this.petsWhereAreNow = petsWhereAreNow; }
    
    public Boolean getPetsSterilized() { return petsSterilized; }
    public void setPetsSterilized(Boolean petsSterilized) { this.petsSterilized = petsSterilized; }
    
    public String getSterilizationReason() { return sterilizationReason; }
    public void setSterilizationReason(String sterilizationReason) { this.sterilizationReason = sterilizationReason; }
    
    public Boolean getHasChildren() { return hasChildren; }
    public void setHasChildren(Boolean hasChildren) { this.hasChildren = hasChildren; }
    
    public String getChildrenAges() { return childrenAges; }
    public void setChildrenAges(String childrenAges) { this.childrenAges = childrenAges; }
    
    public String getHouseholdSize() { return householdSize; }
    public void setHouseholdSize(String householdSize) { this.householdSize = householdSize; }
    
    public Boolean getAllAgree() { return allAgree; }
    public void setAllAgree(Boolean allAgree) { this.allAgree = allAgree; }
    
    public Boolean getAnyAllergies() { return anyAllergies; }
    public void setAnyAllergies(Boolean anyAllergies) { this.anyAllergies = anyAllergies; }
    
    public String getLivingType() { return livingType; }
    public void setLivingType(String livingType) { this.livingType = livingType; }
    
    public String getMovingPlans() { return movingPlans; }
    public void setMovingPlans(String movingPlans) { this.movingPlans = movingPlans; }
    
    public Boolean getHasSpace() { return hasSpace; }
    public void setHasSpace(Boolean hasSpace) { this.hasSpace = hasSpace; }
    
    public String getAccessAreas() { return accessAreas; }
    public void setAccessAreas(String accessAreas) { this.accessAreas = accessAreas; }
    
    public String getSleepingPlace() { return sleepingPlace; }
    public void setSleepingPlace(String sleepingPlace) { this.sleepingPlace = sleepingPlace; }
    
    public Boolean getHasEscapeSpaces() { return hasEscapeSpaces; }
    public void setHasEscapeSpaces(Boolean hasEscapeSpaces) { this.hasEscapeSpaces = hasEscapeSpaces; }
    
    public String getBehaviorIssuesResponse() { return behaviorIssuesResponse; }
    public void setBehaviorIssuesResponse(String behaviorIssuesResponse) { this.behaviorIssuesResponse = behaviorIssuesResponse; }
    
    public String getWhoPaysExpenses() { return whoPaysExpenses; }
    public void setWhoPaysExpenses(String whoPaysExpenses) { this.whoPaysExpenses = whoPaysExpenses; }
    
    public Boolean getHasVetResources() { return hasVetResources; }
    public void setHasVetResources(Boolean hasVetResources) { this.hasVetResources = hasVetResources; }
    
    public List<String> getCareCommitments() { return careCommitments; }
    public void setCareCommitments(List<String> careCommitments) { this.careCommitments = careCommitments; }
    
    public Boolean getSterilizeCommitment() { return sterilizeCommitment; }
    public void setSterilizeCommitment(Boolean sterilizeCommitment) { this.sterilizeCommitment = sterilizeCommitment; }
    
    public Boolean getAcceptsVisits() { return acceptsVisits; }
    public void setAcceptsVisits(Boolean acceptsVisits) { this.acceptsVisits = acceptsVisits; }
    
    public Boolean getAcceptsTerms() { return acceptsTerms; }
    public void setAcceptsTerms(Boolean acceptsTerms) { this.acceptsTerms = acceptsTerms; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
    
    public LocalDateTime getReviewDate() { return reviewDate; }
    public void setReviewDate(LocalDateTime reviewDate) { this.reviewDate = reviewDate; }
    
    public String getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(String reviewedBy) { this.reviewedBy = reviewedBy; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}