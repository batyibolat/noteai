package com.aisummarizer.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "summaries")
public class Summary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "original_text", columnDefinition = "TEXT")
    private String originalText;

    @Column(name = "summary_text", columnDefinition = "TEXT")
    private String summaryText;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Конструкторы
    public Summary() {
        this.createdAt = LocalDateTime.now();
    }

    public Summary(Long userId, String originalText, String summaryText) {
        this.userId = userId;
        this.originalText = originalText;
        this.summaryText = summaryText;
        this.createdAt = LocalDateTime.now();
    }

    // Геттеры и сеттеры
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getOriginalText() {
        return originalText;
    }

    public void setOriginalText(String originalText) {
        this.originalText = originalText;
    }

    public String getSummaryText() {
        return summaryText;
    }

    public void setSummaryText(String summaryText) {
        this.summaryText = summaryText;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}