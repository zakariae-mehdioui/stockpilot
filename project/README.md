# StockPilot — Cloud-Native Inventory Management

A full-stack inventory management system: a React + TypeScript dashboard frontend and a Spring Boot 3 / Java 21 REST backend.

## Frontend (this directory)

A modern, responsive inventory dashboard built with React, Vite, and Tailwind CSS. Data is persisted in a provisioned PostgreSQL database (Supabase).

### Tech Stack
- **React 18** + **TypeScript**
- **Vite** build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** HTTP client (configured for the backend REST API)
- **Recharts** for charts
- **Lucide React** for icons
- **Supabase JS** for database + auth

### Features
- **Login / Sign-up** — email/password authentication
- **Dashboard** — total products, total orders, revenue, low-stock, revenue area chart, category pie chart, recent orders
- **Products** — search, category/status filters, pagination, add/edit/delete, details modal
- **Orders** — list, search, status filter, pagination, inline status updates
- **Profile** — personal information
- **Settings** — notifications, theme, security preferences
- Fully responsive with sidebar + topbar layout

### Project Structure
```
src/
  components/
    layout/     Sidebar, Topbar, Layout, ProtectedRoute
    ui/         Button, Card, Input, Select, Textarea, Modal, Badge, Pagination, Spinner, EmptyState, StatCard
  context/      AuthContext (Supabase session)
  lib/          supabase client, axios api client, services (data access), format helpers
  pages/        Login, Dashboard, Products, Orders, Profile, Settings, NotFound
  types/        shared TypeScript types
```

## Backend (`backend/`)

A production-ready Spring Boot 3.3.2 / Java 21 REST API with JWT auth, Spring Security, JPA + PostgreSQL, Bean Validation, Swagger OpenAPI, and SLF4J logging.

See `backend/README.md` for full details.

### Quick start
```bash
cd backend
docker compose up --build
# API: http://localhost:8080/api
# Swagger: http://localhost:8080/api/swagger-ui.html
```

### Endpoints
| Method | Path                       | Auth |
|--------|----------------------------|------|
| POST   | `/api/auth/login`          | —    |
| POST   | `/api/auth/register`       | —    |
| GET    | `/api/products`            | JWT  |
| GET    | `/api/products/{id}`       | JWT  |
| POST   | `/api/products`            | JWT  |
| PUT    | `/api/products/{id}`       | JWT  |
| DELETE | `/api/products/{id}`       | JWT  |

### Default credentials
- Email: `admin@stockpilot.io`
- Password: `Admin@12345`
