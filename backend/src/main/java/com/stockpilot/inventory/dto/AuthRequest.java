package com.stockpilot.inventory.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;

/**
 * Authentication request payload.
 */
@Schema(name = "AuthRequest", description = "Login credentials")
@Builder
public record AuthRequest(
        @Schema(description = "User email", example = "admin@stockpilot.io")
        @NotBlank(message = "email is required")
        @Email(message = "email must be a valid email address")
        String email,

        @Schema(description = "User password", example = "Admin@12345")
        @NotBlank(message = "password is required")
        @Size(min = 6, message = "password must be at least 6 characters")
        String password
) {
}
