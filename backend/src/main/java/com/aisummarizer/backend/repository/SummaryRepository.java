package com.aisummarizer.backend.repository;

import com.aisummarizer.backend.model.Summary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SummaryRepository extends JpaRepository<Summary, Long> {
    List<Summary> findByUserId(Long userId);
}