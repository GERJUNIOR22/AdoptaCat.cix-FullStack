package com.adoptacat.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "cat_images")
public class CatImage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cat_id", nullable = false)
    private Cat cat;
    
    @Column(name = "image_url", nullable = false)
    private String imageUrl;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "image_type")
    private ImageType imageType = ImageType.GALLERY;
    
    @Column(name = "alt_text")
    private String altText;
    
    @Column(name = "display_order")
    private Integer displayOrder = 0;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors
    public CatImage() {}
    
    public CatImage(Cat cat, String imageUrl, ImageType imageType) {
        this.cat = cat;
        this.imageUrl = imageUrl;
        this.imageType = imageType;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Cat getCat() { return cat; }
    public void setCat(Cat cat) { this.cat = cat; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public ImageType getImageType() { return imageType; }
    public void setImageType(ImageType imageType) { this.imageType = imageType; }
    
    public String getAltText() { return altText; }
    public void setAltText(String altText) { this.altText = altText; }
    
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public enum ImageType {
        MAIN, GALLERY
    }
}