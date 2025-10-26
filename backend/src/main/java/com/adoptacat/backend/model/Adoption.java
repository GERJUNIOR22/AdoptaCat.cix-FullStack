package com.adoptacat.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "adoptions")
public class Adoption {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cat_id", nullable = false)
    private Cat cat;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private AdoptionApplication application;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "adopter_user_id")
    private User adopterUser;
    
    @Column(name = "adoption_date", nullable = false)
    private LocalDate adoptionDate;
    
    @Column(name = "adoption_fee")
    private BigDecimal adoptionFee = BigDecimal.ZERO;
    
    @Column(name = "contract_signed")
    private Boolean contractSigned = false;
    
    @Column(name = "contract_file_url")
    private String contractFileUrl;
    
    @Column(name = "follow_up_required")
    private Boolean followUpRequired = true;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relaciones
    @OneToMany(mappedBy = "adoption", cascade = CascadeType.ALL)
    private List<FollowUpVisit> followUpVisits = new ArrayList<>();
    
    // Constructors
    public Adoption() {}
    
    public Adoption(Cat cat, AdoptionApplication application, LocalDate adoptionDate) {
        this.cat = cat;
        this.application = application;
        this.adoptionDate = adoptionDate;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Cat getCat() { return cat; }
    public void setCat(Cat cat) { this.cat = cat; }
    
    public AdoptionApplication getApplication() { return application; }
    public void setApplication(AdoptionApplication application) { this.application = application; }
    
    public User getAdopterUser() { return adopterUser; }
    public void setAdopterUser(User adopterUser) { this.adopterUser = adopterUser; }
    
    public LocalDate getAdoptionDate() { return adoptionDate; }
    public void setAdoptionDate(LocalDate adoptionDate) { this.adoptionDate = adoptionDate; }
    
    public BigDecimal getAdoptionFee() { return adoptionFee; }
    public void setAdoptionFee(BigDecimal adoptionFee) { this.adoptionFee = adoptionFee; }
    
    public Boolean getContractSigned() { return contractSigned; }
    public void setContractSigned(Boolean contractSigned) { this.contractSigned = contractSigned; }
    
    public String getContractFileUrl() { return contractFileUrl; }
    public void setContractFileUrl(String contractFileUrl) { this.contractFileUrl = contractFileUrl; }
    
    public Boolean getFollowUpRequired() { return followUpRequired; }
    public void setFollowUpRequired(Boolean followUpRequired) { this.followUpRequired = followUpRequired; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public List<FollowUpVisit> getFollowUpVisits() { return followUpVisits; }
    public void setFollowUpVisits(List<FollowUpVisit> followUpVisits) { this.followUpVisits = followUpVisits; }
}