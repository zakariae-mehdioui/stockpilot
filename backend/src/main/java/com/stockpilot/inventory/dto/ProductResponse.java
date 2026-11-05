package com.stockpilot.inventory.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Response payload representing a product.
 */
@Schema(name = "ProductResponse", description = "A product in the catalog")
@Builder
public record ProductResponse(
        Long id,
        String name,
        String sku,
        String category,
        BigDecimal price,
        BigDecimal cost,
        Integer stock,
        String description,
        @JsonProperty("image_url") String imageUrl,
        String status,
        @JsonProperty("created_at") Instant createdAt,
        @JsonProperty("updated_at") Instant updatedAt
) {
}
