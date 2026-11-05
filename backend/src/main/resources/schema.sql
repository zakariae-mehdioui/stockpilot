-- Schema for the Spring Boot backend (app_users table only).
-- `products` and `orders` are managed by Hibernate's ddl-auto=update from the JPA entities.

CREATE TABLE IF NOT EXISTS app_users (
    id          BIGSERIAL PRIMARY KEY,
    email       TEXT NOT NULL UNIQUE,
    password    TEXT NOT NULL,
    role        TEXT NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT now()
);
