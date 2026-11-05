package com.stockpilot.inventory.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Thrown when a request conflicts with existing state (e.g. duplicate SKU).
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class ResourceConflictException extends RuntimeException {

    public ResourceConflictException(String message) {
        super(message);
    }
}
