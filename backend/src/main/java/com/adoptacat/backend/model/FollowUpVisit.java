package com.adoptacat.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "follow_up_visits")
public class FollowUpVisit {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "adoption_id", nullable = false)
    private Adoption adoption;
    
    @Column(name = "visit_date", nullable = false)
    private LocalDate visitDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "visit_type")
    private VisitType visitType = VisitType.ROUTINE;
    
    @Column(name = "visitor_name")
    private String visitorName;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "cat_condition")
    private Condition catCondition = Condition.GOOD;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "home_condition")
    private HomeCondition homeCondition = HomeCondition.GOOD;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "adopter_satisfaction")
    private Satisfaction adopterSatisfaction = Satisfaction.SATISFIED;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "photos_urls")
    private List<String> photosUrls;
    
    @Column(name = "next_visit_date")
    private LocalDate nextVisitDate;
    
    @Column(name = "visit_completed")
    private Boolean visitCompleted = false;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public FollowUpVisit() {}
    
    public FollowUpVisit(Adoption adoption, LocalDate visitDate, String visitorName) {
        this.adoption = adoption;
        this.visitDate = visitDate;
        this.visitorName = visitorName;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Adoption getAdoption() { return adoption; }
    public void setAdoption(Adoption adoption) { this.adoption = adoption; }
    
    public LocalDate getVisitDate() { return visitDate; }
    public void setVisitDate(LocalDate visitDate) { this.visitDate = visitDate; }
    
    public VisitType getVisitType() { return visitType; }
    public void setVisitType(VisitType visitType) { this.visitType = visitType; }
    
    public String getVisitorName() { return visitorName; }
    public void setVisitorName(String visitorName) { this.visitorName = visitorName; }
    
    public Condition getCatCondition() { return catCondition; }
    public void setCatCondition(Condition catCondition) { this.catCondition = catCondition; }
    
    public HomeCondition getHomeCondition() { return homeCondition; }
    public void setHomeCondition(HomeCondition homeCondition) { this.homeCondition = homeCondition; }
    
    public Satisfaction getAdopterSatisfaction() { return adopterSatisfaction; }
    public void setAdopterSatisfaction(Satisfaction adopterSatisfaction) { this.adopterSatisfaction = adopterSatisfaction; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public List<String> getPhotosUrls() { return photosUrls; }
    public void setPhotosUrls(List<String> photosUrls) { this.photosUrls = photosUrls; }
    
    public LocalDate getNextVisitDate() { return nextVisitDate; }
    public void setNextVisitDate(LocalDate nextVisitDate) { this.nextVisitDate = nextVisitDate; }
    
    public Boolean getVisitCompleted() { return visitCompleted; }
    public void setVisitCompleted(Boolean visitCompleted) { this.visitCompleted = visitCompleted; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Enums
    public enum VisitType {
        SCHEDULED, EMERGENCY, ROUTINE
    }
    
    public enum Condition {
        EXCELLENT, GOOD, FAIR, POOR, CRITICAL
    }
    
    public enum HomeCondition {
        EXCELLENT, GOOD, FAIR, POOR
    }
    
    public enum Satisfaction {
        VERY_SATISFIED, SATISFIED, NEUTRAL, DISSATISFIED, VERY_DISSATISFIED
    }
}