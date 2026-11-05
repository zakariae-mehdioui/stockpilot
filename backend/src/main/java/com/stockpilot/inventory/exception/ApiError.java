package com.stockpilot.inventory.exception;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.time.Instant;
import java.util.List;

/**
 * Structured error body returned by the global exception handler.
 */
@Schema(name = "ApiError", description = "Structured API error response")
@Builder
public record ApiError(
        @Schema(description = "HTTP status code") int status,
        @Schema(description = "Error summary") String error,
        @Schema(description = "Human-readable message") String message,
        @Schema(description = "Request path") String path,
        @Schema(description = "Timestamp") Instant timestamp,
        @Schema(description = "Field-level validation errors") List<FieldError> errors
) {
    @Schema(name = "FieldError", description = "A single field validation error")
    public record FieldError(String field, String message) {
    }
}
