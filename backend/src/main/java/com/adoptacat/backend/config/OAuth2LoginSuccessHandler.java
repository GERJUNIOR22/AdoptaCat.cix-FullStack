package com.adoptacat.backend.config;

import com.adoptacat.backend.model.User;
import com.adoptacat.backend.repository.UserRepository;
import com.adoptacat.backend.security.JwtTokenProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    public OAuth2LoginSuccessHandler(UserRepository userRepository,
            JwtTokenProvider jwtTokenProvider,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String googleId = oauth2User.getAttribute("sub");

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setFullName(name);
            user.setGoogleId(googleId);
            user.setRole(User.Role.USER);
            user.setIsActive(true);
            user.setEmailVerified(true);
            user.setPerfilCompleto(false);
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));

            userRepository.save(user);
        } else {
            if (user.getGoogleId() == null) {
                user.setGoogleId(googleId);
                userRepository.save(user);
            }
        }

        String token = jwtTokenProvider.generateToken(email);

        String redirectUrl = "http://localhost:4200/?name=" + name + "&email=" + email + "&token=" + token;
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}