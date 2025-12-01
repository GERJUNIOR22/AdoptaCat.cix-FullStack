package com.adoptacat.backend.service;

import com.adoptacat.backend.model.BlogPost;
import com.adoptacat.backend.model.User;
import com.adoptacat.backend.repository.BlogPostRepository;
import com.adoptacat.backend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class BlogService {

    private final BlogPostRepository blogPostRepository;
    private final UserRepository userRepository;

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    public BlogService(BlogPostRepository blogPostRepository, UserRepository userRepository) {
        this.blogPostRepository = blogPostRepository;
        this.userRepository = userRepository;
    }

    /**
     * Obtener todos los posts (para admin)
     */
    public Page<BlogPost> getAllPosts(int page, int size, String sortBy, String sortDirection) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return blogPostRepository.findAll(pageable);
    }

    /**
     * Obtener posts publicados (para vista pública)
     */
    public Page<BlogPost> getPublishedPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "publishedAt"));
        return blogPostRepository.findByStatus(BlogPost.PostStatus.PUBLISHED, pageable);
    }

    /**
     * Obtener posts por categoría
     */
    public Page<BlogPost> getPostsByCategory(BlogPost.Category category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "publishedAt"));
        return blogPostRepository.findByStatusAndCategory(BlogPost.PostStatus.PUBLISHED, category, pageable);
    }

    /**
     * Obtener post por slug
     */
    @Transactional
    public Optional<BlogPost> getPostBySlug(String slug) {
        Optional<BlogPost> post = blogPostRepository.findBySlug(slug);
        post.ifPresent(p -> {
            p.setViewCount(p.getViewCount() + 1);
            blogPostRepository.save(p);
        });
        return post;
    }

    /**
     * Obtener post por ID
     */
    public Optional<BlogPost> getPostById(Long id) {
        return blogPostRepository.findById(id);
    }

    /**
     * Crear nuevo post
     */
    @Transactional
    public BlogPost createPost(BlogPost post, Long authorId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("Autor no encontrado"));

        post.setAuthor(author);

        if (post.getSlug() == null || post.getSlug().isEmpty()) {
            post.setSlug(toSlug(post.getTitle()));
        }

        // Ensure slug uniqueness
        String originalSlug = post.getSlug();
        int counter = 1;
        while (blogPostRepository.existsBySlug(post.getSlug())) {
            post.setSlug(originalSlug + "-" + counter++);
        }

        if (post.getStatus() == BlogPost.PostStatus.PUBLISHED && post.getPublishedAt() == null) {
            post.setPublishedAt(LocalDateTime.now());
        }

        return blogPostRepository.save(post);
    }

    /**
     * Actualizar post existente
     */
    @Transactional
    public BlogPost updatePost(Long id, BlogPost postDetails) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post no encontrado"));

        post.setTitle(postDetails.getTitle());
        post.setContent(postDetails.getContent());
        post.setExcerpt(postDetails.getExcerpt());
        post.setCategory(postDetails.getCategory());
        post.setFeaturedImageUrl(postDetails.getFeaturedImageUrl());
        post.setIsFeatured(postDetails.getIsFeatured());

        // Update status and published date logic
        if (post.getStatus() != BlogPost.PostStatus.PUBLISHED
                && postDetails.getStatus() == BlogPost.PostStatus.PUBLISHED) {
            post.setPublishedAt(LocalDateTime.now());
        }
        post.setStatus(postDetails.getStatus());

        // Update slug if title changed significantly or requested?
        // Usually better to keep slug stable unless explicitly changed to avoid
        // breaking links.
        if (postDetails.getSlug() != null && !postDetails.getSlug().isEmpty()
                && !postDetails.getSlug().equals(post.getSlug())) {
            String newSlug = postDetails.getSlug();
            if (!newSlug.equals(post.getSlug()) && blogPostRepository.existsBySlug(newSlug)) {
                throw new RuntimeException("El slug ya existe");
            }
            post.setSlug(newSlug);
        }

        return blogPostRepository.save(post);
    }

    /**
     * Eliminar post
     */
    @Transactional
    public void deletePost(Long id) {
        blogPostRepository.deleteById(id);
    }

    /**
     * Helper para generar slugs
     */
    public String toSlug(String input) {
        if (input == null) {
            return "";
        }
        String nowhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }
}
