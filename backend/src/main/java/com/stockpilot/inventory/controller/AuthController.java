package com.stockpilot.inventory.controller;

import com.stockpilot.inventory.dto.AuthRequest;
import com.stockpilot.inventory.dto.AuthResponse;
import com.stockpilot.inventory.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Authentication endpoints: login and registration.
 */
@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "JWT login and registration")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(summary = "Login", description = "Authenticate and receive a JWT access token")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        log.info("POST /auth/login email={}", request.email());
        return ResponseEntity.ok(authService.login(request));
    }

    @Operation(summary = "Register", description = "Create a new user account")
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody AuthRequest request) {
        log.info("POST /auth/register email={}", request.email());
        return ResponseEntity.ok(authService.register(request));
    }
}
