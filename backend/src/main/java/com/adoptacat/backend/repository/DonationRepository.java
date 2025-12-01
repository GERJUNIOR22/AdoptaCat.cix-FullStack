package com.adoptacat.backend.repository;

import com.adoptacat.backend.model.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {

    List<Donation> findByUserId(Long userId);
    List<Donation> findByStatus(Donation.Status status);
}