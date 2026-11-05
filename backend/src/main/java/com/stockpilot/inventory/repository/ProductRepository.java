package com.stockpilot.inventory.repository;

import com.stockpilot.inventory.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA repository for {@link Product} entities.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    boolean existsBySku(String sku);

    Optional<Product> findBySku(String sku);
}
