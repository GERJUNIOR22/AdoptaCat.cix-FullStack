package com.adoptacat.backend.controller;

import com.adoptacat.backend.model.BlogPost;
import com.adoptacat.backend.model.User;
import com.adoptacat.backend.service.BlogService;
import com.adoptacat.backend.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/blog")
@CrossOrigin(origins = "http://localhost:4200")
public class BlogController {

    private final BlogService blogService;
    private final UserService userService;

    public BlogController(BlogService blogService, UserService userService) {
        this.blogService = blogService;
        this.userService = userService;
    }

    // ============================================
    // PUBLIC ENDPOINTS
    // ============================================

    @GetMapping
    public ResponseEntity<Page<BlogPost>> getPublishedPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(blogService.getPublishedPosts(page, size));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<BlogPost> getPostBySlug(@PathVariable String slug) {
        return blogService.getPostBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<Page<BlogPost>> getPostsByCategory(
            @PathVariable BlogPost.Category category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(blogService.getPostsByCategory(category, page, size));
    }

    // ============================================
    // ADMIN ENDPOINTS
    // ============================================

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<BlogPost>> getAllPostsAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {
        return ResponseEntity.ok(blogService.getAllPosts(page, size, sortBy, sortDirection));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BlogPost> createPost(@RequestBody BlogPost post) {
        try {
            System.out.println("=== INICIO CREACIÓN DE POST ===");
            System.out.println("1. Título del post: " + post.getTitle());

            // Get current user from security context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("2. Authentication obtenido: " + (authentication != null ? "SÍ" : "NO"));

            if (authentication == null) {
                throw new RuntimeException("No hay autenticación");
            }

            String email;
            if (authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails) {
                org.springframework.security.core.userdetails.UserDetails userDetails = (org.springframework.security.core.userdetails.UserDetails) authentication
                        .getPrincipal();
                email = userDetails.getUsername();
                System.out.println("3. Email extraído de UserDetails: " + email);
            } else {
                email = authentication.getName();
                System.out.println("3. Email extraído de getName(): " + email);
            }

            System.out.println("4. Buscando usuario con email: " + email);
            Optional<User> userOptional = userService.findByEmail(email);
            System.out.println("5. Usuario encontrado: " + (userOptional.isPresent() ? "SÍ" : "NO"));

            if (!userOptional.isPresent()) {
                System.out.println("ERROR: Usuario no encontrado en la base de datos");
                throw new RuntimeException("Usuario no encontrado con email: " + email);
            }

            User author = userOptional.get();
            System.out.println("6. ID del autor: " + author.getId());
            System.out.println("7. Nombre del autor: " + author.getFullName());

            System.out.println("8. Llamando a blogService.createPost...");
            BlogPost createdPost = blogService.createPost(post, author.getId());
            System.out.println("9. Post creado exitosamente con ID: " + createdPost.getId());
            System.out.println("=== FIN CREACIÓN DE POST (ÉXITO) ===");

            return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
        } catch (Exception e) {
            System.out.println("=== ERROR EN CREACIÓN DE POST ===");
            System.out.println("Tipo de error: " + e.getClass().getName());
            System.out.println("Mensaje: " + e.getMessage());
            e.printStackTrace();

            try (java.io.PrintWriter pw = new java.io.PrintWriter(
                    new java.io.FileOutputStream("backend_error.log", true))) {
                pw.println("=== ERROR CREANDO POST ===");
                pw.println("Timestamp: " + java.time.LocalDateTime.now());
                pw.println("Mensaje: " + e.getMessage());
                e.printStackTrace(pw);
                pw.println("=========================");
            } catch (Exception ioEx) {
                // Ignore logging error
            }

            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BlogPost> updatePost(@PathVariable Long id, @RequestBody BlogPost post) {
        try {
            BlogPost updatedPost = blogService.updatePost(id, post);
            return ResponseEntity.ok(updatedPost);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        try {
            blogService.deletePost(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
