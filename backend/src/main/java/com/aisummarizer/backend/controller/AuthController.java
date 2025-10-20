package com.aisummarizer.backend.controller;

import com.aisummarizer.backend.model.User;
import com.aisummarizer.backend.security.JwtUtil;
import com.aisummarizer.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> userData) {
        try {
            String email = userData.get("email");
            String phoneNumber = userData.get("phoneNumber");
            String password = userData.get("password");

            if (email == null || password == null) {
                return ResponseEntity.badRequest().body("Email and password are required");
            }

            User user = new User();
            user.setEmail(email);
            user.setPhoneNumber(phoneNumber);
            user.setPasswordHash(password); // будет захешировано в сервисе

            User registeredUser = userService.registerUser(user);

            Map<String, String> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("email", registeredUser.getEmail());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
        try {
            String email = loginRequest.get("email");
            String password = loginRequest.get("password");

            if (email == null || password == null) {
                return ResponseEntity.badRequest().body("Email and password are required");
            }

            var userOptional = userService.findByEmail(email);
            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid email or password");
            }

            User user = userOptional.get();
            if (!userService.validatePassword(password, user.getPasswordHash())) {
                return ResponseEntity.badRequest().body("Invalid email or password");
            }

            String token = jwtUtil.generateToken(user.getEmail());

            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("email", user.getEmail());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error");
        }
    }
}