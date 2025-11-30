package com.adoptacat.backend.repository;

import com.adoptacat.backend.model.Adoption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AdoptionRepository extends JpaRepository<Adoption, Long> {

    List<Adoption> findByUserId(Long userId);
    List<Adoption> findByCatId(String catId);
    List<Adoption> findByStatus(Adoption.Status status);
}