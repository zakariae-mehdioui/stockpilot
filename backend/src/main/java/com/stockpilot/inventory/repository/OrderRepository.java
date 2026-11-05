package com.stockpilot.inventory.repository;

import com.stockpilot.inventory.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA repository for {@link Order} entities.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    boolean existsByOrderNumber(String orderNumber);

    Optional<Order> findByOrderNumber(String orderNumber);
}
