package com.stockpilot.inventory.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.List;

/**
 * Centralised exception handling for all controllers.
 * <p>
 * Translates domain and framework exceptions into a consistent {@link ApiError}
 * JSON structure with appropriate HTTP status codes.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(ResourceNotFoundException ex, HttpServletRequest req) {
        log.warn("Not found: {}", ex.getMessage());
        return build(HttpStatus.NOT_FOUND, ex.getMessage(), req, null);
    }

    @ExceptionHandler(ResourceConflictException.class)
    public ResponseEntity<ApiError> handleConflict(ResourceConflictException ex, HttpServletRequest req) {
        log.warn("Conflict: {}", ex.getMessage());
        return build(HttpStatus.CONFLICT, ex.getMessage(), req, null);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiError> handleAuth(AuthenticationException ex, HttpServletRequest req) {
        log.warn("Authentication failed: {}", ex.getMessage());
        return build(HttpStatus.UNAUTHORIZED, ex.getMessage(), req, null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {
        List<ApiError.FieldError> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> new ApiError.FieldError(fe.getField(), fe.getDefaultMessage()))
                .toList();
        log.warn("Validation failed for {}: {} field error(s)", req.getRequestURI(), errors.size());
        return build(HttpStatus.BAD_REQUEST, "Validation failed", req, errors);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> handleAccessDenied(AccessDeniedException ex, HttpServletRequest req) {
        log.warn("Access denied: {}", ex.getMessage());
        return build(HttpStatus.FORBIDDEN, "Access denied", req, null);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArg(IllegalArgumentException ex, HttpServletRequest req) {
        log.warn("Bad request: {}", ex.getMessage());
        return build(HttpStatus.BAD_REQUEST, ex.getMessage(), req, null);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneric(Exception ex, HttpServletRequest req) {
        log.error("Unhandled exception on {}: {}", req.getRequestURI(), ex.getMessage(), ex);
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error", req, null);
    }

    private ResponseEntity<ApiError> build(HttpStatus status, String message,
                                           HttpServletRequest req, List<ApiError.FieldError> errors) {
        ApiError body = ApiError.builder()
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .path(req.getRequestURI())
                .timestamp(Instant.now())
                .errors(errors)
                .build();
        return ResponseEntity.status(status).body(body);
    }
}
