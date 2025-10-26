package com.adoptacat.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
public class Donation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "donor_name")
    private String donorName;
    
    @Column(name = "donor_email")
    private String donorEmail;
    
    @Column(name = "donor_phone")
    private String donorPhone;
    
    @Column(nullable = false)
    private BigDecimal amount;
    
    private String currency = "PEN";
    
    @Enumerated(EnumType.STRING)
    @Column(name = "donation_type")
    private DonationType donationType = DonationType.MONEY;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "donation_method")
    private DonationMethod donationMethod = DonationMethod.YAPE;
    
    @Enumerated(EnumType.STRING)
    private Purpose purpose = Purpose.GENERAL;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "specific_cat_id")
    private Cat specificCat;
    
    @Column(name = "payment_reference")
    private String paymentReference;
    
    @Column(name = "transaction_id")
    private String transactionId;
    
    @Column(name = "is_recurring")
    private Boolean isRecurring = false;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "recurring_frequency")
    private RecurringFrequency recurringFrequency;
    
    @Enumerated(EnumType.STRING)
    private DonationStatus status = DonationStatus.PENDING;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Donation() {}
    
    public Donation(BigDecimal amount, DonationType donationType, String donorEmail) {
        this.amount = amount;
        this.donationType = donationType;
        this.donorEmail = donorEmail;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getDonorName() { return donorName; }
    public void setDonorName(String donorName) { this.donorName = donorName; }
    
    public String getDonorEmail() { return donorEmail; }
    public void setDonorEmail(String donorEmail) { this.donorEmail = donorEmail; }
    
    public String getDonorPhone() { return donorPhone; }
    public void setDonorPhone(String donorPhone) { this.donorPhone = donorPhone; }
    
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    
    public DonationType getDonationType() { return donationType; }
    public void setDonationType(DonationType donationType) { this.donationType = donationType; }
    
    public DonationMethod getDonationMethod() { return donationMethod; }
    public void setDonationMethod(DonationMethod donationMethod) { this.donationMethod = donationMethod; }
    
    public Purpose getPurpose() { return purpose; }
    public void setPurpose(Purpose purpose) { this.purpose = purpose; }
    
    public Cat getSpecificCat() { return specificCat; }
    public void setSpecificCat(Cat specificCat) { this.specificCat = specificCat; }
    
    public String getPaymentReference() { return paymentReference; }
    public void setPaymentReference(String paymentReference) { this.paymentReference = paymentReference; }
    
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    
    public Boolean getIsRecurring() { return isRecurring; }
    public void setIsRecurring(Boolean isRecurring) { this.isRecurring = isRecurring; }
    
    public RecurringFrequency getRecurringFrequency() { return recurringFrequency; }
    public void setRecurringFrequency(RecurringFrequency recurringFrequency) { this.recurringFrequency = recurringFrequency; }
    
    public DonationStatus getStatus() { return status; }
    public void setStatus(DonationStatus status) { this.status = status; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Enums
    public enum DonationType {
        MONEY, FOOD, MEDICINE, SUPPLIES, OTHER
    }
    
    public enum DonationMethod {
        YAPE, PLIN, BANK_TRANSFER, CASH, CARD, OTHER
    }
    
    public enum Purpose {
        GENERAL, FOOD, VETERINARY, STERILIZATION, EMERGENCY, SPECIFIC_CAT
    }
    
    public enum RecurringFrequency {
        WEEKLY, MONTHLY, QUARTERLY, YEARLY
    }
    
    public enum DonationStatus {
        PENDING, COMPLETED, FAILED, REFUNDED
    }
}