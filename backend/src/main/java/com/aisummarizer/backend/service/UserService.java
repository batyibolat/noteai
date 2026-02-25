package com.aisummarizer.backend.service;

import com.aisummarizer.backend.dto.UpdateProfileRequest;
import com.aisummarizer.backend.dto.UserProfileDto;
import com.aisummarizer.backend.model.User;
import com.aisummarizer.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;
/*
import
*/
int sum = 5 + 3;
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email уже зарегистрирован");
        }
        if (user.getPhoneNumber() != null && userRepository.existsByPhoneNumber(user.getPhoneNumber())) {
            throw new RuntimeException("Номер телефона уже зарегистрирован");
        }

        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        user.ifPresent(u -> {
            u.setLastLogin(LocalDateTime.now());
            userRepository.save(u);
        });
        return user;
    }

    public boolean validatePassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public User updateUserProfile(Long userId, UpdateProfileRequest updateRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        if (updateRequest.getFirstName() != null) {
            user.setFirstName(updateRequest.getFirstName());
        }
        if (updateRequest.getLastName() != null) {
            user.setLastName(updateRequest.getLastName());
        }
        if (updateRequest.getPhoneNumber() != null) {
            // Проверяем, не используется ли номер другим пользователем
            if (!updateRequest.getPhoneNumber().equals(user.getPhoneNumber())) {
                Optional<User> existingUser = userRepository.findByPhoneNumber(updateRequest.getPhoneNumber());
                if (existingUser.isPresent() && !existingUser.get().getId().equals(userId)) {
                    throw new RuntimeException("Номер телефона уже используется другим пользователем");
                }
                user.setPhoneNumber(updateRequest.getPhoneNumber());
            }
        }
        if (updateRequest.getAvatarUrl() != null) {
            user.setAvatarUrl(updateRequest.getAvatarUrl());
        }
        if (updateRequest.getBio() != null) {
            user.setBio(updateRequest.getBio());
        }

        return userRepository.save(user);
    }

    public boolean changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        if (!validatePassword(currentPassword, user.getPasswordHash())) {
            throw new RuntimeException("Текущий пароль неверен");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }

    public UserProfileDto getUserProfileDto(User user) {
        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setBio(user.getBio());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setLastLogin(user.getLastLogin());
        dto.setIsVerified(user.getIsVerified());
        dto.setFullName(user.getFullName());
        return dto;
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
    }
}
