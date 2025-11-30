package com.adoptacat.backend.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class CatResponse {

    private String id;
    private String name;
    private String gender;
    private Integer edadMeses;
    private String size;
    private Boolean isVaccinated;
    private Boolean isSterilized;
    private String description;
    private String adoptionStatus;
    private LocalDateTime ingresoAt;
    private List<CatImageResponse> images;
    private LocalDateTime createdAt;

    // Constructors
    public CatResponse() {
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Integer getEdadMeses() {
        return edadMeses;
    }

    public void setEdadMeses(Integer edadMeses) {
        this.edadMeses = edadMeses;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public Boolean getIsVaccinated() {
        return isVaccinated;
    }

    public void setIsVaccinated(Boolean isVaccinated) {
        this.isVaccinated = isVaccinated;
    }

    public Boolean getIsSterilized() {
        return isSterilized;
    }

    public void setIsSterilized(Boolean isSterilized) {
        this.isSterilized = isSterilized;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAdoptionStatus() {
        return adoptionStatus;
    }

    public void setAdoptionStatus(String adoptionStatus) {
        this.adoptionStatus = adoptionStatus;
    }

    public LocalDateTime getIngresoAt() {
        return ingresoAt;
    }

    public void setIngresoAt(LocalDateTime ingresoAt) {
        this.ingresoAt = ingresoAt;
    }

    public List<CatImageResponse> getImages() {
        return images;
    }

    public void setImages(List<CatImageResponse> images) {
        this.images = images;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}