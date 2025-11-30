package com.adoptacat.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

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

    @Column(name = "password", nullable = false)
    @NotBlank
    private String passwordHash;

    @Column(name = "google_id")
    private String googleId;

    @Column(name = "full_name", nullable = false)
    @NotBlank
    private String fullName;

    private String phone;

    private String direccion;

    private String ciudad;

    @Column(name = "tipo_vivienda")
    private String tipoVivienda;

    @Column(name = "experiencia_previas", columnDefinition = "TEXT")
    private String experienciaPrevias;

    @Column(name = "tiene_mas_mascotas")
    private Boolean tieneMasMascotas = false;

    @Column(name = "perfil_completo")
    private Boolean perfilCompleto = false;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "email_verified")
    private Boolean emailVerified = false;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

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
    public User() {
    }

    public User(String email, String passwordHash, String fullName, Role role) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
        this.role = role;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getGoogleId() {
        return googleId;
    }

    public void setGoogleId(String googleId) {
        this.googleId = googleId;
    }

    // Alias para compatibilidad con Spring Security UserDetails
    public String getPassword() {
        return passwordHash;
    }

    public void setPassword(String password) {
        this.passwordHash = password;
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

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public String getTipoVivienda() {
        return tipoVivienda;
    }

    public void setTipoVivienda(String tipoVivienda) {
        this.tipoVivienda = tipoVivienda;
    }

    public String getExperienciaPrevias() {
        return experienciaPrevias;
    }

    public void setExperienciaPrevias(String experienciaPrevias) {
        this.experienciaPrevias = experienciaPrevias;
    }

    public Boolean getTieneMasMascotas() {
        return tieneMasMascotas;
    }

    public void setTieneMasMascotas(Boolean tieneMasMascotas) {
        this.tieneMasMascotas = tieneMasMascotas;
    }

    public Boolean getPerfilCompleto() {
        return perfilCompleto;
    }

    public void setPerfilCompleto(Boolean perfilCompleto) {
        this.perfilCompleto = perfilCompleto;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(Boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
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

    public List<AdoptionApplication> getReviewedApplications() {
        return reviewedApplications;
    }

    public void setReviewedApplications(List<AdoptionApplication> reviewedApplications) {
        this.reviewedApplications = reviewedApplications;
    }

    public List<BlogPost> getBlogPosts() {
        return blogPosts;
    }

    public void setBlogPosts(List<BlogPost> blogPosts) {
        this.blogPosts = blogPosts;
    }

    public enum Role {
        USER, ADMIN
    }
}