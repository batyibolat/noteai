package com.aisummarizer.backend.controller;

import com.aisummarizer.backend.model.Summary;
import com.aisummarizer.backend.model.User;
import com.aisummarizer.backend.repository.UserRepository;
import com.aisummarizer.backend.security.JwtUtil;
import com.aisummarizer.backend.service.SummaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/summaries")
@CrossOrigin(origins = "http://localhost:3000")
public class SummaryController {

    @Autowired
    private SummaryService summaryService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RestTemplate restTemplate;

    @PostMapping("/summarize")
    public ResponseEntity<?> createSummary(@RequestBody Map<String, String> request,
                                           @RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractEmail(token.substring(7));

            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Пользователь не найден");
            }

            User user = userOptional.get();
            String text = request.get("text");
            String title = request.get("title");

            if (text == null || text.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Текст не может быть пустым");
            }

            // Сначала пробуем получить AI конспект
            String summaryText;
            try {
                String pythonServiceUrl = "http://localhost:5000/api/summarize";
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                Map<String, String> pythonRequest = new HashMap<>();
                pythonRequest.put("text", text);
                HttpEntity<Map<String, String>> entity = new HttpEntity<>(pythonRequest, headers);

                ResponseEntity<Map> pythonResponse = restTemplate.postForEntity(pythonServiceUrl, entity, Map.class);

                if (pythonResponse.getStatusCode() == HttpStatus.OK && pythonResponse.getBody() != null) {
                    summaryText = (String) pythonResponse.getBody().get("summary");
                    if (summaryText == null) {
                        summaryText = "Не удалось создать конспект. Попробуйте позже.";
                    }
                } else {
                    summaryText = "Ошибка сервиса AI. Попробуйте позже.";
                }
            } catch (Exception e) {
                summaryText = "Конспект создан в упрощенном режиме. AI сервис временно недоступен.";
            }

            // Создаем и сохраняем конспект
            Summary summary = new Summary();
            summary.setUserId(user.getId());
            summary.setTitle(title != null && !title.trim().isEmpty() ? title :
                    "Конспект от " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm")));
            summary.setOriginalText(text);
            summary.setSummaryText(summaryText);
            summary.setDocumentType("TEXT");
            summary.setLanguage("ru");

            Summary savedSummary = summaryService.saveSummary(summary);

            Map<String, Object> response = new HashMap<>();
            response.put("summary", summaryText);
            response.put("id", savedSummary.getId());
            response.put("title", savedSummary.getTitle());
            response.put("compressionRatio", savedSummary.getCompressionRatio());
            response.put("message", "Конспект успешно создан");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ошибка: " + e.getMessage());
        }
    }

    @PostMapping("/summarize-file")
    public ResponseEntity<?> createSummaryFromFile(@RequestBody Map<String, Object> request,
                                                   @RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractEmail(token.substring(7));

            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Пользователь не найден");
            }

            User user = userOptional.get();
            String originalText = (String) request.get("originalText");
            String summaryText = (String) request.get("summaryText");
            String title = (String) request.get("title");
            String documentType = (String) request.get("documentType");
            String originalFileName = (String) request.get("originalFileName");
            Integer originalLength = (Integer) request.get("originalLength");
            Integer summaryLength = (Integer) request.get("summaryLength");

            if (originalText == null || originalText.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Оригинальный текст не может быть пустым");
            }

            if (summaryText == null || summaryText.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Текст конспекта не может быть пустым");
            }

            // Создаем и сохраняем конспект из файла
            Summary summary = new Summary();
            summary.setUserId(user.getId());
            summary.setTitle(title != null && !title.trim().isEmpty() ? title :
                    "Конспект файла от " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm")));
            summary.setOriginalText(originalText);
            summary.setSummaryText(summaryText);
            summary.setDocumentType(documentType != null ? documentType : "FILE");
            summary.setOriginalFileName(originalFileName);
            summary.setOriginalLength(originalLength);
            summary.setSummaryLength(summaryLength);
            summary.setLanguage("ru");

            Summary savedSummary = summaryService.saveSummary(summary);

            Map<String, Object> response = new HashMap<>();
            response.put("summary", summaryText);
            response.put("id", savedSummary.getId());
            response.put("title", savedSummary.getTitle());
            response.put("compressionRatio", savedSummary.getCompressionRatio());
            response.put("message", "Конспект из файла успешно создан и сохранен");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ошибка при сохранении конспекта из файла: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserSummaries(@RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractEmail(token.substring(7));

            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Пользователь не найден");
            }

            User user = userOptional.get();
            List<Summary> summaries = summaryService.getUserSummaries(user.getId());
            return ResponseEntity.ok(summaries);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ошибка при получении конспектов: " + e.getMessage());
        }
    }

    @GetMapping("/favorites")
    public ResponseEntity<?> getUserFavorites(@RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractEmail(token.substring(7));

            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Пользователь не найден");
            }

            User user = userOptional.get();
            List<Summary> favorites = summaryService.getUserFavorites(user.getId());
            return ResponseEntity.ok(favorites);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ошибка при получении избранных: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<?> toggleFavorite(@PathVariable Long id,
                                            @RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractEmail(token.substring(7));

            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Пользователь не найден");
            }

            Summary summary = summaryService.toggleFavorite(id);
            Map<String, Object> response = new HashMap<>();
            response.put("id", summary.getId());
            response.put("isFavorite", summary.getIsFavorite());
            response.put("message", summary.getIsFavorite() ? "Добавлено в избранное" : "Удалено из избранного");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ошибка: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSummary(@PathVariable Long id,
                                           @RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractEmail(token.substring(7));

            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Пользователь не найден");
            }

            summaryService.deleteSummary(id);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Конспект успешно удален");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ошибка при удалении: " + e.getMessage());
        }
    }

    @PostMapping("/test-save")
    public ResponseEntity<?> testSave(@RequestHeader("Authorization") String token,
                                      @RequestBody Map<String, String> request) {
        try {
            String email = jwtUtil.extractEmail(token.substring(7));
            Optional<User> userOptional = userRepository.findByEmail(email);

            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Пользователь не найден");
            }

            User user = userOptional.get();
            String text = request.get("text");
            String title = request.get("title");

            Summary summary = new Summary();
            summary.setUserId(user.getId());
            summary.setTitle(title != null ? title : "Тестовый конспект");
            summary.setOriginalText(text);
            summary.setSummaryText("Это тестовый конспект для проверки сохранения в базу данных.");
            summary.setDocumentType("TEST");
            summary.setLanguage("ru");

            Summary savedSummary = summaryService.saveSummary(summary);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Тестовый конспект успешно сохранен");
            response.put("id", savedSummary.getId());
            response.put("userId", savedSummary.getUserId());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ошибка тестового сохранения: " + e.getMessage());
        }
    }
}