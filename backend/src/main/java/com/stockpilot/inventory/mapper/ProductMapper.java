package com.stockpilot.inventory.mapper;

import com.stockpilot.inventory.dto.ProductRequest;
import com.stockpilot.inventory.dto.ProductResponse;
import com.stockpilot.inventory.entity.Product;

/**
 * Maps between {@link Product} entities and DTOs.
 */
public final class ProductMapper {

    private ProductMapper() {
    }

    public static Product toEntity(ProductRequest req) {
        return Product.builder()
                .name(req.name())
                .sku(req.sku())
                .category(req.category())
                .price(req.price())
                .cost(req.cost())
                .stock(req.stock())
                .description(req.description())
                .imageUrl(req.imageUrl())
                .status(req.status())
                .build();
    }

    public static ProductResponse toResponse(Product p) {
        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .sku(p.getSku())
                .category(p.getCategory())
                .price(p.getPrice())
                .cost(p.getCost())
                .stock(p.getStock())
                .description(p.getDescription())
                .imageUrl(p.getImageUrl())
                .status(p.getStatus())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }

    public static void updateEntity(Product p, ProductRequest req) {
        p.setName(req.name());
        p.setSku(req.sku());
        p.setCategory(req.category());
        p.setPrice(req.price());
        p.setCost(req.cost());
        p.setStock(req.stock());
        p.setDescription(req.description());
        p.setImageUrl(req.imageUrl());
        p.setStatus(req.status());
    }
}
