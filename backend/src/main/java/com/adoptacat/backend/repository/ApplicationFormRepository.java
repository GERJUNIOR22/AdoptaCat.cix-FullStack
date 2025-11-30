package com.adoptacat.backend.repository;

import com.adoptacat.backend.model.ApplicationForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ApplicationFormRepository extends JpaRepository<ApplicationForm, Long> {

    // Since it's one-to-one with application, no need for extra methods
}