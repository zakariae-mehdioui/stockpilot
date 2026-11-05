package com.stockpilot.inventory.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.math.BigDecimal;

/**
 * Request payload for creating or updating a product.
 */
@Schema(name = "ProductRequest", description = "Payload to create or update a product")
@Builder
public record ProductRequest(
        @Schema(description = "Product name", example = "Aurora Wireless Headphones")
        @NotBlank(message = "name is required")
        String name,

        @Schema(description = "Unique stock keeping unit", example = "SKU-1001")
        @NotBlank(message = "sku is required")
        String sku,

        @Schema(description = "Product category", example = "Electronics")
        @NotBlank(message = "category is required")
        String category,

        @Schema(description = "Selling price", example = "199.99")
        @NotNull(message = "price is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "price must be greater than 0")
        BigDecimal price,

        @Schema(description = "Unit cost", example = "85.00")
        @NotNull(message = "cost is required")
        @DecimalMin(value = "0.0", message = "cost must be positive")
        BigDecimal cost,

        @Schema(description = "Units in stock", example = "142")
        @NotNull(message = "stock is required")
        @Min(value = 0, message = "stock cannot be negative")
        Integer stock,

        @Schema(description = "Product description", example = "Noise-cancelling headphones")
        String description,

        @Schema(description = "Image URL", example = "https://example.com/photo.jpg")
        @JsonProperty("image_url")
        String imageUrl,

        @Schema(description = "Status: active, out_of_stock, discontinued", example = "active")
        @NotBlank(message = "status is required")
        String status
) {
}
