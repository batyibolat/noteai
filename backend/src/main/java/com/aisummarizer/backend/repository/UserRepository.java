package com.aisummarizer.backend.repository;

import com.aisummarizer.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByPhoneNumber(String phoneNumber);

    Boolean existsByEmail(String email);

    Boolean existsByPhoneNumber(String phoneNumber);
}