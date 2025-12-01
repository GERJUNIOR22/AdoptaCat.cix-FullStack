package com.adoptacat.backend.repository;

import com.adoptacat.backend.model.BlogPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {

    Optional<BlogPost> findBySlug(String slug);

    Page<BlogPost> findByStatus(BlogPost.PostStatus status, Pageable pageable);

    Page<BlogPost> findByCategory(BlogPost.Category category, Pageable pageable);

    Page<BlogPost> findByStatusAndCategory(BlogPost.PostStatus status, BlogPost.Category category, Pageable pageable);

    boolean existsBySlug(String slug);
}
