package com.adoptacat.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "veterinary_expenses")
public class VeterinaryExpense {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cat_id", nullable = false)
    private Cat cat;
    
    @Column(name = "vet_clinic_name")
    private String vetClinicName;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "treatment_type", nullable = false)
    private TreatmentType treatmentType;
    
    @Column(name = "treatment_description", columnDefinition = "TEXT")
    private String treatmentDescription;
    
    @Column(name = "expense_date", nullable = false)
    private LocalDate expenseDate;
    
    @Column(nullable = false)
    private BigDecimal amount;
    
    private String currency = "PEN";
    
    @Enumerated(EnumType.STRING)
    @Column(name = "paid_by")
    private PaidBy paidBy = PaidBy.ORGANIZATION;
    
    @Column(name = "receipt_number")
    private String receiptNumber;
    
    @Column(name = "receipt_image_url")
    private String receiptImageUrl;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public VeterinaryExpense() {}
    
    public VeterinaryExpense(Cat cat, TreatmentType treatmentType, BigDecimal amount, LocalDate expenseDate) {
        this.cat = cat;
        this.treatmentType = treatmentType;
        this.amount = amount;
        this.expenseDate = expenseDate;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Cat getCat() { return cat; }
    public void setCat(Cat cat) { this.cat = cat; }
    
    public String getVetClinicName() { return vetClinicName; }
    public void setVetClinicName(String vetClinicName) { this.vetClinicName = vetClinicName; }
    
    public TreatmentType getTreatmentType() { return treatmentType; }
    public void setTreatmentType(TreatmentType treatmentType) { this.treatmentType = treatmentType; }
    
    public String getTreatmentDescription() { return treatmentDescription; }
    public void setTreatmentDescription(String treatmentDescription) { this.treatmentDescription = treatmentDescription; }
    
    public LocalDate getExpenseDate() { return expenseDate; }
    public void setExpenseDate(LocalDate expenseDate) { this.expenseDate = expenseDate; }
    
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    
    public PaidBy getPaidBy() { return paidBy; }
    public void setPaidBy(PaidBy paidBy) { this.paidBy = paidBy; }
    
    public String getReceiptNumber() { return receiptNumber; }
    public void setReceiptNumber(String receiptNumber) { this.receiptNumber = receiptNumber; }
    
    public String getReceiptImageUrl() { return receiptImageUrl; }
    public void setReceiptImageUrl(String receiptImageUrl) { this.receiptImageUrl = receiptImageUrl; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Enums
    public enum TreatmentType {
        VACCINATION, STERILIZATION, EMERGENCY, ROUTINE_CHECKUP, SURGERY, MEDICATION, OTHER
    }
    
    public enum PaidBy {
        ORGANIZATION, ADOPTER, VOLUNTEER, DONOR
    }
}