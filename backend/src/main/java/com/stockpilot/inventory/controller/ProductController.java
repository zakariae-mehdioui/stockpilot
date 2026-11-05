package com.stockpilot.inventory.controller;

import com.stockpilot.inventory.dto.ProductRequest;
import com.stockpilot.inventory.dto.ProductResponse;
import com.stockpilot.inventory.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;

/**
 * REST controller for product CRUD operations.
 */
@RestController
@RequestMapping("/products")
@Tag(name = "Products", description = "CRUD API for catalog products")
public class ProductController {

    private static final Logger log = LoggerFactory.getLogger(ProductController.class);

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @Operation(summary = "List all products")
    @GetMapping
    public ResponseEntity<List<ProductResponse>> list() {
        log.info("GET /products");
        return ResponseEntity.ok(productService.findAll());
    }

    @Operation(summary = "Get a product by id")
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getById(@Parameter(description = "Product id") @PathVariable Long id) {
        log.info("GET /products/{}", id);
        return ResponseEntity.ok(productService.findById(id));
    }

    @Operation(summary = "Create a product")
    @PostMapping
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody ProductRequest request) {
        log.info("POST /products sku={}", request.sku());
        ProductResponse created = productService.create(request);
        return ResponseEntity.created(URI.create("/products/" + created.id())).body(created);
    }

    @Operation(summary = "Update a product")
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(@Parameter(description = "Product id") @PathVariable Long id,
                                                  @Valid @RequestBody ProductRequest request) {
        log.info("PUT /products/{}", id);
        return ResponseEntity.ok(productService.update(id, request));
    }

    @Operation(summary = "Delete a product")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@Parameter(description = "Product id") @PathVariable Long id) {
        log.info("DELETE /products/{}", id);
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
