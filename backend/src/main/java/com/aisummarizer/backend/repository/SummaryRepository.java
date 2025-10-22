package com.aisummarizer.backend.repository;

import com.aisummarizer.backend.model.Summary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SummaryRepository extends JpaRepository<Summary, Long> {

    // Найти все конспекты пользователя, отсортированные по дате создания (новые сначала)
    List<Summary> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Найти избранные конспекты пользователя
    List<Summary> findByUserIdAndIsFavoriteOrderByCreatedAtDesc(Long userId, Boolean isFavorite);

    // Поиск конспектов по заголовку или содержанию
    @Query("SELECT s FROM Summary s WHERE s.userId = :userId AND " +
            "(LOWER(s.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(s.summaryText) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Summary> findByUserIdAndTitleContainingIgnoreCaseOrSummaryTextContainingIgnoreCase(
            @Param("userId") Long userId,
            @Param("query") String query);

    // Поиск конспектов по тегам
    @Query("SELECT s FROM Summary s WHERE s.userId = :userId AND " +
            "LOWER(s.tags) LIKE LOWER(CONCAT('%', :tag, '%'))")
    List<Summary> findByUserIdAndTagsContainingIgnoreCase(
            @Param("userId") Long userId,
            @Param("tag") String tag);

    // Получить количество конспектов пользователя
    Long countByUserId(Long userId);

    // Получить количество избранных конспектов пользователя
    Long countByUserIdAndIsFavorite(Long userId, Boolean isFavorite);
}