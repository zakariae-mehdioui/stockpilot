package com.stockpilot.inventory.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Enables JPA auditing for createdAt / updatedAt timestamps on entities.
 */
@Configuration
@EnableJpaAuditing
public class JpaAuditingConfig {
}
