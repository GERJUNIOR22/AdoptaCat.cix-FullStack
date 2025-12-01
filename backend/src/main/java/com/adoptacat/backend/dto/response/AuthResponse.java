package com.adoptacat.backend.dto.response;

public class AuthResponse {
    private String token;
    private String message;
    private String email;

    private String role;
    private String fullName;

    public AuthResponse() {
    }

    public AuthResponse(String token, String message, String email, String role, String fullName) {
        this.token = token;
        this.message = message;
        this.email = email;
        this.role = role;
        this.fullName = fullName;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}
