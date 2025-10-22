package com.aisummarizer.backend.controller;

import com.aisummarizer.backend.dto.ChangePasswordRequest;
import com.aisummarizer.backend.dto.UpdateProfileRequest;
import com.aisummarizer.backend.dto.UserProfileDto;
import com.aisummarizer.backend.model.User;
import com.aisummarizer.backend.security.JwtUtil;
import com.aisummarizer.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractEmail(token.substring(7));
            Optional<User> userOptional = userService.findByEmail(email);

            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("Пользователь не найден");
            }

            UserProfileDto profileDto = userService.getUserProfileDto(userOptional.get());
            return ResponseEntity.ok(profileDto);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка при получении профиля: " + e.getMessage());
        }
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestHeader("Authorization") String token,
                                           @RequestBody UpdateProfileRequest updateRequest) {
        try {
            String email = jwtUtil.extractEmail(token.substring(7));
            Optional<User> userOptional = userService.findByEmail(email);

            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("Пользователь не найден");
            }

            User user = userService.updateUserProfile(userOptional.get().getId(), updateRequest);
            UserProfileDto profileDto = userService.getUserProfileDto(user);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Профиль успешно обновлен");
            response.put("profile", profileDto);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка при обновлении профиля: " + e.getMessage());
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestHeader("Authorization") String token,
                                            @RequestBody ChangePasswordRequest passwordRequest) {
        try {
            String email = jwtUtil.extractEmail(token.substring(7));
            Optional<User> userOptional = userService.findByEmail(email);

            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("Пользователь не найден");
            }

            // Валидация
            if (!passwordRequest.getNewPassword().equals(passwordRequest.getConfirmPassword())) {
                return ResponseEntity.badRequest().body("Новые пароли не совпадают");
            }

            if (passwordRequest.getNewPassword().length() < 6) {
                return ResponseEntity.badRequest().body("Новый пароль должен содержать минимум 6 символов");
            }

            userService.changePassword(
                    userOptional.get().getId(),
                    passwordRequest.getCurrentPassword(),
                    passwordRequest.getNewPassword()
            );

            Map<String, String> response = new HashMap<>();
            response.put("message", "Пароль успешно изменен");

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка при изменении пароля: " + e.getMessage());
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getUserStats(@RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractEmail(token.substring(7));
            Optional<User> userOptional = userService.findByEmail(email);

            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("Пользователь не найден");
            }

            // Здесь можно добавить логику для получения статистики пользователя
            // Пока возвращаем базовую статистику
            Map<String, Object> stats = new HashMap<>();
            stats.put("userId", userOptional.get().getId());
            stats.put("memberSince", userOptional.get().getCreatedAt());
            stats.put("lastLogin", userOptional.get().getLastLogin());

            return ResponseEntity.ok(stats);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка при получении статистики: " + e.getMessage());
        }
    }
}