package com.stockpilot.inventory.security;

import com.stockpilot.inventory.entity.AppUser;
import com.stockpilot.inventory.repository.AppUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Creates a default admin user on first startup so the API is immediately usable.
 */
@Component
public class AdminUserBootstrap implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminUserBootstrap.class);

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.security.bootstrap-admin-email}")
    private String adminEmail;

    @Value("${app.security.bootstrap-admin-password}")
    private String adminPassword;

    public AdminUserBootstrap(AppUserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.existsByEmail(adminEmail)) {
            log.info("Bootstrap admin user already exists: {}", adminEmail);
            return;
        }
        AppUser admin = AppUser.builder()
                .email(adminEmail)
                .password(passwordEncoder.encode(adminPassword))
                .role("ADMIN")
                .build();
        userRepository.save(admin);
        log.info("Bootstrap admin user created: {}", adminEmail);
    }
}
