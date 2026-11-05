# StockPilot Inventory API — Spring Boot 3 / Java 21

A production-ready REST backend for the StockPilot inventory management dashboard.

## Tech Stack

| Layer            | Technology                          |
|------------------|-------------------------------------|
| Framework        | Spring Boot 3.3.2                   |
| Language         | Java 21                             |
| Database         | PostgreSQL                          |
| ORM              | Spring Data JPA / Hibernate         |
| Security         | Spring Security + JWT (jjwt 0.12)   |
| Validation       | Bean Validation (jakarta.validation)|
| Documentation    | Swagger / OpenAPI (springdoc 2.6)   |
| Logging          | SLF4J (Logback)                     |
| Build            | Maven                               |

## Architecture (Clean / Layered)

```
controller   →  REST endpoints, request/response mapping
service      →  business logic, transaction boundaries
repository   →  Spring Data JPA persistence
entity       →  JPA-mapped domain models
dto          →  request/response records (decoupled from entities)
exception    →  global handler + domain exceptions
security     →  JWT provider, filter, security config, user bootstrap
config       →  OpenAPI, JPA auditing, CORS
mapper       →  entity ↔ DTO conversion
```

## Endpoints

### Auth (public)
| Method | Path             | Description          |
|--------|------------------|----------------------|
| POST   | `/api/auth/login`    | Login, returns JWT    |
| POST   | `/api/auth/register` | Register a new user   |

### Products (JWT required)
| Method | Path                  | Description          |
|--------|-----------------------|----------------------|
| GET    | `/api/products`       | List all products    |
| GET    | `/api/products/{id}`  | Get product by id    |
| POST   | `/api/products`       | Create a product     |
| PUT    | `/api/products/{id}`  | Update a product     |
| DELETE | `/api/products/{id}`  | Delete a product     |

All paths are prefixed with `/api` (set via `server.servlet.context-path`).

## Running

### Prerequisites
- Java 21
- Maven 3.9+
- PostgreSQL 14+ (or use the bundled `docker-compose.yml`)

### Option 1 — Docker Compose (recommended)
```bash
docker compose up --build
```
This starts PostgreSQL and the API. The API is reachable at `http://localhost:8080/api`.

### Option 2 — Local Maven
```bash
# Start Postgres, then:
./mvnw spring-boot:run
```

### Environment Variables
| Variable                      | Default                          | Purpose                     |
|-------------------------------|----------------------------------|-----------------------------|
| `SPRING_DATASOURCE_URL`       | `jdbc:postgresql://localhost:5432/inventory` | DB connection URL |
| `SPRING_DATASOURCE_USERNAME`  | `postgres`                       | DB username                 |
| `SPRING_DATASOURCE_PASSWORD`  | `postgres`                       | DB password                 |
| `JWT_SECRET`                  | (dev default)                    | JWT signing secret (≥32 chars) |
| `ADMIN_EMAIL`                 | `admin@stockpilot.io`            | Bootstrap admin email       |
| `ADMIN_PASSWORD`              | `Admin@12345`                    | Bootstrap admin password    |

## Swagger / OpenAPI

Once running, interactive API docs are available at:

- **Swagger UI**: `http://localhost:8080/api/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8080/api/v3/api-docs`

Click **Authorize** and paste `Bearer <token>` (from `/auth/login`) to call secured endpoints.

## Authentication Flow

1. `POST /api/auth/login` with `{ "email": "...", "password": "..." }`.
2. Receive `{ "token": "...", "type": "Bearer", ... }`.
3. Send every subsequent request with header `Authorization: Bearer <token>`.
4. The `JwtAuthenticationFilter` validates the token and sets the security context.

A default admin user (`admin@stockpilot.io` / `Admin@12345`) is created on first startup via `AdminUserBootstrap`.

## Validation

All request DTOs use Bean Validation annotations (`@NotBlank`, `@Email`, `@DecimalMin`, `@Min`, `@Size`).
Validation failures return `400 Bad Request` with a structured `ApiError` body listing each field error.

## Exception Handling

`GlobalExceptionHandler` (`@RestControllerAdvice`) maps all exceptions to a consistent `ApiError` JSON:

| Exception                       | HTTP Status |
|---------------------------------|-------------|
| `ResourceNotFoundException`     | 404         |
| `ResourceConflictException`     | 409         |
| `AuthenticationException`       | 401         |
| `MethodArgumentNotValidException` | 400       |
| `AccessDeniedException`         | 403         |
| `IllegalArgumentException`      | 400         |
| Any other `Exception`           | 500         |

## Logging

SLF4J via Logback. Controller/service layers log at INFO for state changes and DEBUG for diagnostics.
Configure levels in `application.properties` (`logging.level.*`).
