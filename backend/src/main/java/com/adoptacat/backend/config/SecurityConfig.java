package com.adoptacat.backend.config;

import com.adoptacat.backend.security.JwtFilter;
import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        private final JwtFilter jwtFilter;
        private final OAuth2LoginSuccessHandler oauth2LoginSuccessHandler;

        public SecurityConfig(JwtFilter jwtFilter, OAuth2LoginSuccessHandler oauth2LoginSuccessHandler) {
                this.jwtFilter = jwtFilter;
                this.oauth2LoginSuccessHandler = oauth2LoginSuccessHandler;
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(csrf -> csrf.disable())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(authz -> authz

                                                .requestMatchers(
                                                                "/api/auth/**",
                                                                "/api/cats/**",
                                                                "/api/adoption-applications/**",
                                                                "/api/adoption-profiles/**",
                                                                "/v3/api-docs/**",
                                                                "/swagger-ui/**",
                                                                "/actuator/**")
                                                .permitAll()

                                                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                                                .anyRequest().authenticated())

                                .oauth2Login(oauth2 -> oauth2
                                                .successHandler(oauth2LoginSuccessHandler))

                                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)

                                .headers(headers -> headers
                                                .frameOptions(frameOptions -> frameOptions.sameOrigin()));

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();

                configuration.setAllowedOriginPatterns(Arrays.asList(
                                "http://localhost:*",
                                "http://127.0.0.1:*",
                                "https://adopcatcix.netlify.app"));

                configuration.setAllowedMethods(Arrays.asList(
                                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"));

                configuration.setAllowedHeaders(Arrays.asList("*"));

                configuration.setExposedHeaders(Arrays.asList(
                                "Authorization", "Content-Type", "Content-Length", "Content-Disposition"));

                configuration.setAllowCredentials(true);
                configuration.setMaxAge(3600L);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/api/**", configuration);
                source.registerCorsConfiguration("/oauth2/**", configuration);
                source.registerCorsConfiguration("/login/**", configuration);

                return source;
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder(12);
        }
}