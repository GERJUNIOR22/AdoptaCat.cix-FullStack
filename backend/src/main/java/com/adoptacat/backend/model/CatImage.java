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

    @Column(nullable = false)
    private String url;

    private Integer orden = 0;
    
    // Constructors
    public CatImage() {}

    public CatImage(Cat cat, String url, Integer orden) {
        this.cat = cat;
        this.url = url;
        this.orden = orden;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Cat getCat() { return cat; }
    public void setCat(Cat cat) { this.cat = cat; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public Integer getOrden() { return orden; }
    public void setOrden(Integer orden) { this.orden = orden; }
}