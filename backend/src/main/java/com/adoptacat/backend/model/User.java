package com.adoptacat.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    @Email
    @NotBlank
    private String email;
    
    @Column(nullable = false)
    @NotBlank
    private String password;
    
    @Column(name = "full_name", nullable = false)
    @NotBlank
    private String fullName;
    
    private String phone;
    
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "email_verified")
    private Boolean emailVerified = false;
    
    @Column(name = "profile_image_url")
    private String profileImageUrl;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relaciones
    @OneToMany(mappedBy = "reviewedBy", cascade = CascadeType.ALL)
    private List<AdoptionApplication> reviewedApplications = new ArrayList<>();
    
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL)
    private List<BlogPost> blogPosts = new ArrayList<>();
    
    // Constructors
    public User() {}
    
    public User(String email, String password, String fullName, Role role) {
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public Boolean getEmailVerified() { return emailVerified; }
    public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }
    
    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public List<AdoptionApplication> getReviewedApplications() { return reviewedApplications; }
    public void setReviewedApplications(List<AdoptionApplication> reviewedApplications) { this.reviewedApplications = reviewedApplications; }
    
    public List<BlogPost> getBlogPosts() { return blogPosts; }
    public void setBlogPosts(List<BlogPost> blogPosts) { this.blogPosts = blogPosts; }
    
    public enum Role {
        USER, ADMIN
    }
}