package com.stockpilot.inventory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the StockPilot Inventory Management REST API.
 * <p>
 * Spring Boot 3 / Java 21 application exposing a JWT-secured CRUD API for products
 * and orders over PostgreSQL.
 */
@SpringBootApplication
public class InventoryApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(InventoryApiApplication.class, args);
    }
}
