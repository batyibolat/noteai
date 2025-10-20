package com.aisummarizer.backend.controller;

import com.aisummarizer.backend.model.Summary;
import com.aisummarizer.backend.model.User;
import com.aisummarizer.backend.repository.SummaryRepository;
import com.aisummarizer.backend.repository.UserRepository;
import com.aisummarizer.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/summaries")
@CrossOrigin(origins = "http://localhost:3000")
public class SummaryController {

    @Autowired
    private SummaryRepository summaryRepository;

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

            // Находим пользователя по email
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            User user = userOptional.get();
            String text = request.get("text");

            if (text == null || text.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Text cannot be empty");
            }

            // Отправляем текст в Python микросервис
            String pythonServiceUrl = "http://localhost:5000/api/summarize";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> pythonRequest = new HashMap<>();
            pythonRequest.put("text", text);
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(pythonRequest, headers);

            ResponseEntity<Map> pythonResponse = restTemplate.postForEntity(pythonServiceUrl, entity, Map.class);

            if (pythonResponse.getStatusCode() == HttpStatus.OK && pythonResponse.getBody() != null) {
                String summaryText = (String) pythonResponse.getBody().get("summary");

                if (summaryText == null) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("AI service returned null summary");
                }

                // Сохраняем в базу данных
                Summary summary = new Summary();
                summary.setUserId(user.getId());
                summary.setOriginalText(text);
                summary.setSummaryText(summaryText);

                Summary savedSummary = summaryRepository.save(summary);

                Map<String, Object> response = new HashMap<>();
                response.put("summary", summaryText);
                response.put("id", savedSummary.getId());

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error processing summary from AI service");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserSummaries(@RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractEmail(token.substring(7));

            // Находим пользователя по email
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            User user = userOptional.get();
            List<Summary> summaries = summaryRepository.findByUserId(user.getId());
            return ResponseEntity.ok(summaries);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving summaries: " + e.getMessage());
        }
    }
}