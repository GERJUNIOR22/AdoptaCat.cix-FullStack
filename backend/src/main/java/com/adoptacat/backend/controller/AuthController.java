package com.adoptacat.backend.controller;

import com.adoptacat.backend.dto.request.UserLoginRequest;
import com.adoptacat.backend.dto.request.UserRegisterRequest;
import com.adoptacat.backend.dto.response.AuthResponse;
import com.adoptacat.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = { "http://localhost:4200", "http://127.0.0.1:4200" })
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody UserRegisterRequest request) {
        try {
            String token = authService.register(request);
            return ResponseEntity.ok(new AuthResponse(token, "Usuario registrado exitosamente", request.getEmail()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, e.getMessage(), null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody UserLoginRequest request) {
        try {
            String token = authService.login(request);
            return ResponseEntity.ok(new AuthResponse(token, "Login exitoso", request.getEmail()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, e.getMessage(), null));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody UserRegisterRequest request) {
        // Alias para register
        return register(request);
    }

    @GetMapping("/validate")
    public ResponseEntity<String> validateToken(@RequestHeader("Authorization") String token) {
        // Endpoint para validar token JWT
        return ResponseEntity.ok("Token válido");
    }
}