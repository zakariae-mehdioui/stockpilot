package com.stockpilot.inventory.service;

import com.stockpilot.inventory.dto.AuthRequest;
import com.stockpilot.inventory.dto.AuthResponse;
import com.stockpilot.inventory.entity.AppUser;
import com.stockpilot.inventory.exception.AuthenticationException;
import com.stockpilot.inventory.repository.AppUserRepository;
import com.stockpilot.inventory.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Authentication service: validates credentials and issues JWT tokens.
 */
@Service
@Transactional
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(AppUserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse login(AuthRequest request) {
        log.info("Login attempt for {}", request.email());
        AppUser user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new AuthenticationException("Invalid email or password"));
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            log.warn("Password mismatch for {}", request.email());
            throw new AuthenticationException("Invalid email or password");
        }
        String token = tokenProvider.generateToken(user.getEmail(), user.getRole());
        log.info("Login successful for {}", request.email());
        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .expiresIn(tokenProvider.getExpirationMs())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public AuthResponse register(AuthRequest request) {
        log.info("Registering new user {}", request.email());
        if (userRepository.existsByEmail(request.email())) {
            throw new AuthenticationException("Email is already registered");
        }
        AppUser user = AppUser.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role("USER")
                .build();
        userRepository.save(user);
        String token = tokenProvider.generateToken(user.getEmail(), user.getRole());
        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .expiresIn(tokenProvider.getExpirationMs())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
