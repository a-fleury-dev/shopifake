package com.shopifake.auth.controller;

import com.shopifake.auth.dto.*;
import com.shopifake.auth.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Login failed", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Object> logout(@RequestBody LogoutRequest request) {
        try {
            if (request.getAccessToken() == null || request.getRefreshToken() == null) return ResponseEntity.status(401).build();

            if (authService.logout(request)) return ResponseEntity.noContent().build();
            else return ResponseEntity.badRequest().build();
         }catch (Exception e) {
            log.error("Logout failed", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<KeycloakTokenResponse> refreshToken(@RequestBody RefreshRequest request) {
        try {
            KeycloakTokenResponse response = authService.refreshToken(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Refresh token failed", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody RegisterRequest request) {
        try {
            UserResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Registration failed", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/user")
    public ResponseEntity<UserResponse> getUserInfo(@RequestHeader("Authorization") String authorization) {
        try {
            log.info("Getting user info, authorization header: {}", authorization.substring(0, Math.min(50, authorization.length())));
            String token = authorization.replace("Bearer ", "");
            UserResponse response = authService.getUserInfo(token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Get user info failed", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Auth Service is running");
    }
}
