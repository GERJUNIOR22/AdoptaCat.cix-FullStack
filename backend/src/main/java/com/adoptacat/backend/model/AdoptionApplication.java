package com.adoptacat.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "adoption_applications")
public class AdoptionApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cat_id", nullable = false)
    private Cat cat;

    @Column(name = "application_number", unique = true, nullable = false)
    private String applicationNumber;

    // Información del candidato
    @Column(name = "full_name", nullable = false)
    @NotBlank
    private String fullName;

    private String phone;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    private String city;
    private String dni;

    @Enumerated(EnumType.STRING)
    @Column(name = "civil_status")
    private CivilStatus civilStatus;

    private String occupation;

    @Column(columnDefinition = "TEXT")
    private String address;

    private String district;

    @Email
    @NotBlank
    private String email;

    private String instagram;
    private String facebook;

    // Experiencia con mascotas
    @Column(name = "why_adopt", columnDefinition = "TEXT")
    private String whyAdopt;

    @Column(name = "has_current_pets")
    private Boolean hasCurrentPets = false;

    @Column(name = "current_pets_details", columnDefinition = "TEXT")
    private String currentPetsDetails;

    @Column(name = "had_previous_pets")
    private Boolean hadPreviousPets = false;

    @Column(name = "previous_pets_details", columnDefinition = "TEXT")
    private String previousPetsDetails;

    @Column(name = "pets_where_are_now", columnDefinition = "TEXT")
    private String petsWhereAreNow;

    @Column(name = "pets_sterilized")
    private Boolean petsSterilized = false;

    @Column(name = "sterilization_reason", columnDefinition = "TEXT")
    private String sterilizationReason;

    // Hogar
    @Column(name = "has_children")
    private Boolean hasChildren = false;

    @Column(name = "children_ages")
    private String childrenAges;

    @Column(name = "household_size")
    private String householdSize;

    @Column(name = "all_agree")
    private Boolean allAgree = false;

    @Column(name = "any_allergies")
    private Boolean anyAllergies = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "living_type")
    private LivingType livingType;

    @Column(name = "moving_plans", columnDefinition = "TEXT")
    private String movingPlans;

    // Recreación y proyección
    @Column(name = "has_space")
    private Boolean hasSpace = false;

    @Column(name = "access_areas", columnDefinition = "TEXT")
    private String accessAreas;

    @Column(name = "sleeping_place", columnDefinition = "TEXT")
    private String sleepingPlace;

    @Column(name = "has_escape_spaces")
    private Boolean hasEscapeSpaces = false;

    @Column(name = "behavior_issues_response", columnDefinition = "TEXT")
    private String behaviorIssuesResponse;

    // Cuidados y gastos
    @Column(name = "who_pays_expenses")
    private String whoPayExpenses;

    @Column(name = "has_vet_resources")
    private Boolean hasVetResources = false;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "care_commitments")
    private List<String> careCommitments;

    @Column(name = "sterilize_commitment")
    private Boolean sterilizeCommitment = false;

    @Column(name = "accepts_visits")
    private Boolean acceptsVisits = false;

    @Column(name = "accepts_terms")
    private Boolean acceptsTerms = false;

    // Estado de la solicitud
    @Enumerated(EnumType.STRING)
    private ApplicationStatus status = ApplicationStatus.PENDING;

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

    @Column(name = "review_date")
    private LocalDateTime reviewDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User reviewedBy;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public AdoptionApplication() {
    }

    public AdoptionApplication(Cat cat, String fullName, String email) {
        this.cat = cat;
        this.fullName = fullName;
        this.email = email;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Cat getCat() {
        return cat;
    }

    public void setCat(Cat cat) {
        this.cat = cat;
    }

    public String getApplicationNumber() {
        return applicationNumber;
    }

    public void setApplicationNumber(String applicationNumber) {
        this.applicationNumber = applicationNumber;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public CivilStatus getCivilStatus() {
        return civilStatus;
    }

    public void setCivilStatus(CivilStatus civilStatus) {
        this.civilStatus = civilStatus;
    }

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getInstagram() {
        return instagram;
    }

    public void setInstagram(String instagram) {
        this.instagram = instagram;
    }

    public String getFacebook() {
        return facebook;
    }

    public void setFacebook(String facebook) {
        this.facebook = facebook;
    }

    public String getWhyAdopt() {
        return whyAdopt;
    }

    public void setWhyAdopt(String whyAdopt) {
        this.whyAdopt = whyAdopt;
    }

    public Boolean getHasCurrentPets() {
        return hasCurrentPets;
    }

    public void setHasCurrentPets(Boolean hasCurrentPets) {
        this.hasCurrentPets = hasCurrentPets;
    }

    public String getCurrentPetsDetails() {
        return currentPetsDetails;
    }

    public void setCurrentPetsDetails(String currentPetsDetails) {
        this.currentPetsDetails = currentPetsDetails;
    }

    public Boolean getHadPreviousPets() {
        return hadPreviousPets;
    }

    public void setHadPreviousPets(Boolean hadPreviousPets) {
        this.hadPreviousPets = hadPreviousPets;
    }

    public String getPreviousPetsDetails() {
        return previousPetsDetails;
    }

    public void setPreviousPetsDetails(String previousPetsDetails) {
        this.previousPetsDetails = previousPetsDetails;
    }

    public String getPetsWhereAreNow() {
        return petsWhereAreNow;
    }

    public void setPetsWhereAreNow(String petsWhereAreNow) {
        this.petsWhereAreNow = petsWhereAreNow;
    }

    public Boolean getPetsSterilized() {
        return petsSterilized;
    }

    public void setPetsSterilized(Boolean petsSterilized) {
        this.petsSterilized = petsSterilized;
    }

    public String getSterilizationReason() {
        return sterilizationReason;
    }

    public void setSterilizationReason(String sterilizationReason) {
        this.sterilizationReason = sterilizationReason;
    }

    public Boolean getHasChildren() {
        return hasChildren;
    }

    public void setHasChildren(Boolean hasChildren) {
        this.hasChildren = hasChildren;
    }

    public String getChildrenAges() {
        return childrenAges;
    }

    public void setChildrenAges(String childrenAges) {
        this.childrenAges = childrenAges;
    }

    public String getHouseholdSize() {
        return householdSize;
    }

    public void setHouseholdSize(String householdSize) {
        this.householdSize = householdSize;
    }

    public Boolean getAllAgree() {
        return allAgree;
    }

    public void setAllAgree(Boolean allAgree) {
        this.allAgree = allAgree;
    }

    public Boolean getAnyAllergies() {
        return anyAllergies;
    }

    public void setAnyAllergies(Boolean anyAllergies) {
        this.anyAllergies = anyAllergies;
    }

    public LivingType getLivingType() {
        return livingType;
    }

    public void setLivingType(LivingType livingType) {
        this.livingType = livingType;
    }

    public String getMovingPlans() {
        return movingPlans;
    }

    public void setMovingPlans(String movingPlans) {
        this.movingPlans = movingPlans;
    }

    public Boolean getHasSpace() {
        return hasSpace;
    }

    public void setHasSpace(Boolean hasSpace) {
        this.hasSpace = hasSpace;
    }

    public String getAccessAreas() {
        return accessAreas;
    }

    public void setAccessAreas(String accessAreas) {
        this.accessAreas = accessAreas;
    }

    public String getSleepingPlace() {
        return sleepingPlace;
    }

    public void setSleepingPlace(String sleepingPlace) {
        this.sleepingPlace = sleepingPlace;
    }

    public Boolean getHasEscapeSpaces() {
        return hasEscapeSpaces;
    }

    public void setHasEscapeSpaces(Boolean hasEscapeSpaces) {
        this.hasEscapeSpaces = hasEscapeSpaces;
    }

    public String getBehaviorIssuesResponse() {
        return behaviorIssuesResponse;
    }

    public void setBehaviorIssuesResponse(String behaviorIssuesResponse) {
        this.behaviorIssuesResponse = behaviorIssuesResponse;
    }

    public String getWhoPayExpenses() {
        return whoPayExpenses;
    }

    public void setWhoPayExpenses(String whoPayExpenses) {
        this.whoPayExpenses = whoPayExpenses;
    }

    public Boolean getHasVetResources() {
        return hasVetResources;
    }

    public void setHasVetResources(Boolean hasVetResources) {
        this.hasVetResources = hasVetResources;
    }

    public List<String> getCareCommitments() {
        return careCommitments;
    }

    public void setCareCommitments(List<String> careCommitments) {
        this.careCommitments = careCommitments;
    }

    public Boolean getSterilizeCommitment() {
        return sterilizeCommitment;
    }

    public void setSterilizeCommitment(Boolean sterilizeCommitment) {
        this.sterilizeCommitment = sterilizeCommitment;
    }

    public Boolean getAcceptsVisits() {
        return acceptsVisits;
    }

    public void setAcceptsVisits(Boolean acceptsVisits) {
        this.acceptsVisits = acceptsVisits;
    }

    public Boolean getAcceptsTerms() {
        return acceptsTerms;
    }

    public void setAcceptsTerms(Boolean acceptsTerms) {
        this.acceptsTerms = acceptsTerms;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public String getAdminNotes() {
        return adminNotes;
    }

    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }

    public LocalDateTime getReviewDate() {
        return reviewDate;
    }

    public void setReviewDate(LocalDateTime reviewDate) {
        this.reviewDate = reviewDate;
    }

    public User getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(User reviewedBy) {
        this.reviewedBy = reviewedBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Enums
    public enum CivilStatus {
        SINGLE, MARRIED, DIVORCED, WIDOWED
    }

    public enum LivingType {
        RENTAL_ALLOWED, RENTAL_NOT_ALLOWED, UNKNOWN, OWN_HOUSE
    }

    public enum ApplicationStatus {
        PENDING, UNDER_REVIEW, APPROVED, REJECTED, CANCELLED
    }
}