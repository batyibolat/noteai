package com.aisummarizer.backend.service;

import com.aisummarizer.backend.model.Summary;
import com.aisummarizer.backend.repository.SummaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SummaryService {

    @Autowired
    private SummaryRepository summaryRepository;

    public List<Summary> getUserSummaries(Long userId) {
        return summaryRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Summary> getUserFavorites(Long userId) {
        return summaryRepository.findByUserIdAndIsFavoriteOrderByCreatedAtDesc(userId, true);
    }

    public Summary saveSummary(Summary summary) {
        return summaryRepository.save(summary);
    }

    public Optional<Summary> getSummaryById(Long id) {
        return summaryRepository.findById(id);
    }

    public void deleteSummary(Long id) {
        summaryRepository.deleteById(id);
    }

    public Summary toggleFavorite(Long id) {
        Summary summary = summaryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Конспект не найден"));
        summary.setIsFavorite(!summary.getIsFavorite());
        return summaryRepository.save(summary);
    }

    public List<Summary> searchSummaries(Long userId, String query) {
        if (query == null || query.trim().isEmpty()) {
            return getUserSummaries(userId);
        }
        return summaryRepository.findByUserIdAndTitleContainingIgnoreCaseOrSummaryTextContainingIgnoreCase(userId, query.trim());
    }

    public List<Summary> getSummariesByTag(Long userId, String tag) {
        return summaryRepository.findByUserIdAndTagsContainingIgnoreCase(userId, tag);
    }

    // Новые методы для статистики
    public Long getTotalSummariesCount(Long userId) {
        return summaryRepository.countByUserId(userId);
    }

    public Long getFavoriteSummariesCount(Long userId) {
        return summaryRepository.countByUserIdAndIsFavorite(userId, true);
    }

    public Long getTotalCharactersProcessed(Long userId) {
        List<Summary> summaries = getUserSummaries(userId);
        return summaries.stream()
                .mapToLong(summary -> summary.getOriginalLength() != null ? summary.getOriginalLength() : 0)
                .sum();
    }
}