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

    @Column(name = "title")
    private String title;

    @Column(name = "original_text", columnDefinition = "TEXT")
    private String originalText;

    @Column(name = "summary_text", columnDefinition = "TEXT")
    private String summaryText;

    @Column(name = "document_type")
    private String documentType; // TEXT, PDF, DOCX, URL

    @Column(name = "original_file_name")
    private String originalFileName;

    @Column(name = "original_length")
    private Integer originalLength;

    @Column(name = "summary_length")
    private Integer summaryLength;

    @Column(name = "compression_ratio")
    private Double compressionRatio;

    @Column(name = "language")
    private String language;

    @Column(name = "is_favorite")
    private Boolean isFavorite = false;

    @Column(name = "tags")
    private String tags; // Теги через запятую

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Конструкторы
    public Summary() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.isFavorite = false;
    }

    public Summary(Long userId, String originalText, String summaryText) {
        this.userId = userId;
        this.originalText = originalText;
        this.summaryText = summaryText;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.isFavorite = false;
        calculateMetrics();
    }

    // Геттеры и сеттеры
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getOriginalText() { return originalText; }
    public void setOriginalText(String originalText) {
        this.originalText = originalText;
        calculateMetrics();
    }

    public String getSummaryText() { return summaryText; }
    public void setSummaryText(String summaryText) {
        this.summaryText = summaryText;
        calculateMetrics();
    }

    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }

    public String getOriginalFileName() { return originalFileName; }
    public void setOriginalFileName(String originalFileName) { this.originalFileName = originalFileName; }

    public Integer getOriginalLength() { return originalLength; }
    public void setOriginalLength(Integer originalLength) { this.originalLength = originalLength; }

    public Integer getSummaryLength() { return summaryLength; }
    public void setSummaryLength(Integer summaryLength) { this.summaryLength = summaryLength; }

    public Double getCompressionRatio() { return compressionRatio; }
    public void setCompressionRatio(Double compressionRatio) { this.compressionRatio = compressionRatio; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public Boolean getIsFavorite() { return isFavorite; }
    public void setIsFavorite(Boolean isFavorite) { this.isFavorite = isFavorite; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Вспомогательные методы
    private void calculateMetrics() {
        if (this.originalText != null) {
            this.originalLength = this.originalText.length();
        }
        if (this.summaryText != null) {
            this.summaryLength = this.summaryText.length();
        }
        if (this.originalLength != null && this.summaryLength != null && this.originalLength > 0) {
            this.compressionRatio = (double) this.summaryLength / this.originalLength;
        }
    }

    public void addTag(String tag) {
        if (this.tags == null || this.tags.isEmpty()) {
            this.tags = tag;
        } else {
            this.tags += "," + tag;
        }
    }
}