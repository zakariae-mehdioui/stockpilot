package com.stockpilot.inventory.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

/**
 * JWT authentication response.
 */
@Schema(name = "AuthResponse", description = "JWT token response")
@Builder
public record AuthResponse(
        @Schema(description = "Access token") String token,
        @Schema(description = "Token type", example = "Bearer") String type,
        @Schema(description = "Token expiry in milliseconds") Long expiresIn,
        @Schema(description = "Authenticated user email") String email,
        @Schema(description = "User role") String role
) {
}
