package com.adoptacat.backend.service;

import com.adoptacat.backend.dto.request.UserLoginRequest;
import com.adoptacat.backend.dto.request.UserRegisterRequest;
import com.adoptacat.backend.dto.response.AuthResponse;
import com.adoptacat.backend.model.User;
import com.adoptacat.backend.repository.UserRepository;
import com.adoptacat.backend.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public AuthResponse register(UserRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole(User.Role.USER);
        user.setPerfilCompleto(false);

        userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getEmail());
        return new AuthResponse(token, "Usuario registrado exitosamente", user.getEmail(), user.getRole().name(),
                user.getFullName());
    }

    public AuthResponse login(UserLoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        User user = userOpt.get();
        String token = jwtTokenProvider.generateToken(user.getEmail());
        return new AuthResponse(token, "Login exitoso", user.getEmail(), user.getRole().name(), user.getFullName());
    }
}