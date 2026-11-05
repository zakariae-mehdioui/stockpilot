package com.stockpilot.inventory.service;

import com.stockpilot.inventory.dto.ProductRequest;
import com.stockpilot.inventory.dto.ProductResponse;
import com.stockpilot.inventory.entity.Product;
import com.stockpilot.inventory.exception.ResourceConflictException;
import com.stockpilot.inventory.exception.ResourceNotFoundException;
import com.stockpilot.inventory.mapper.ProductMapper;
import com.stockpilot.inventory.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Business logic for product CRUD operations.
 */
@Service
@Transactional
public class ProductService {

    private static final Logger log = LoggerFactory.getLogger(ProductService.class);

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> findAll() {
        log.debug("Fetching all products");
        return repository.findAll().stream()
                .map(ProductMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse findById(Long id) {
        log.debug("Fetching product id={}", id);
        Product p = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return ProductMapper.toResponse(p);
    }

    public ProductResponse create(ProductRequest request) {
        log.info("Creating product sku={}", request.sku());
        if (repository.existsBySku(request.sku())) {
            throw new ResourceConflictException("A product with SKU " + request.sku() + " already exists");
        }
        Product saved = repository.save(ProductMapper.toEntity(request));
        log.info("Created product id={} sku={}", saved.getId(), saved.getSku());
        return ProductMapper.toResponse(saved);
    }

    public ProductResponse update(Long id, ProductRequest request) {
        log.info("Updating product id={}", id);
        Product existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        if (!existing.getSku().equals(request.sku())
                && repository.existsBySku(request.sku())) {
            throw new ResourceConflictException("A product with SKU " + request.sku() + " already exists");
        }
        ProductMapper.updateEntity(existing, request);
        Product saved = repository.save(existing);
        log.info("Updated product id={}", saved.getId());
        return ProductMapper.toResponse(saved);
    }

    public void delete(Long id) {
        log.info("Deleting product id={}", id);
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        repository.deleteById(id);
        log.info("Deleted product id={}", id);
    }
}
