# 🎟️ EventZen — Event Management System

A comprehensive full-stack Event Management System built as a capstone project. EventZen enables administrators to manage events, venues, vendors, and budgets while allowing customers to browse events and book tickets seamlessly.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite 8 + Tailwind CSS v4 + Axios + React Router DOM v6 |
| Backend | Spring Boot 3.5.13 (Java 17) + REST APIs |
| Database | MySQL 8 |
| Authentication | JWT (jjwt 0.11.5) with BCrypt encryption |
| API Documentation | Swagger UI (springdoc-openapi 2.8.4) |
| Containerization | Docker + Docker Compose |
| Testing | JUnit 5 + Mockito |
| Build Tool | Maven (Backend) + Vite (Frontend) |
| Version Control | Git + GitHub |

## 📦 Modules (6 Total)

| # | Module | Description |
|---|---|---|
| 1 | Authentication | JWT-based register/login with ADMIN and CUSTOMER roles |
| 2 | Event Management | Create, view, update, delete events with seat tracking |
| 3 | Venue Management | Full CRUD for venues with capacity and amenities |
| 4 | Booking Management | Book seats, cancel bookings, overbooking prevention |
| 5 | Vendor Management | Manage event service providers and contact details |
| 6 | Budget Management | Track allocated vs spent amounts per event category |

## 📁 Project Structure
```
EventZen/
├── backend/
│   ├── src/main/java/com/eventzen/
│   │   ├── config/          # SecurityConfig, CorsConfig, DataInitializer
│   │   ├── controller/      # REST controllers (Auth, Event, Venue, Booking, Vendor, Budget)
│   │   ├── dto/             # Request and Response DTOs
│   │   ├── entity/          # JPA entities (User, Event, Venue, Booking, Vendor, Budget)
│   │   ├── enums/           # Role, EventStatus, BookingStatus, BudgetCategory
│   │   ├── exception/       # Custom exceptions and GlobalExceptionHandler
│   │   ├── repository/      # Spring Data JPA repositories
│   │   ├── security/        # JWT service, filter, UserDetailsService
│   │   └── service/         # Service interfaces and implementations
│   ├── src/main/resources/
│   │   └── application.yaml # App configuration
│   ├── src/test/            # Unit tests (JUnit 5 + Mockito)
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance with JWT interceptor
│   │   ├── components/      # Navbar, AdminShell, BookingCard
│   │   ├── context/         # AuthContext for global auth state
│   │   ├── pages/           # All 11 page components
│   │   ├── App.jsx          # Main app with routing
│   │   └── main.jsx         # Entry point
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🚀 How to Run

### Prerequisites
- Java 17 (JDK)
- Node.js 18+ and npm
- MySQL Server running on localhost:3306
- Git

### Backend
```bash
cd backend
.\mvnw.cmd spring-boot:run
```
- Runs at: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
- Runs at: `http://localhost:5173`

> **Note:** Always start the backend BEFORE the frontend.

### Docker (Production)
```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- MySQL: `localhost:3307`

## 🔑 Default Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| ADMIN | admin@eventzen.com | admin123 | Full system access |
| CUSTOMER | user@eventzen.com | user123 | Browse + Book events |

These accounts are auto-created on first startup via DataInitializer.

## 📋 API Endpoints (24 Total)

### Authentication
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/v1/auth/register | Public | Register new user |
| POST | /api/v1/auth/login | Public | Login and get JWT token |

### Events
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/v1/events | Public | Get all events |
| GET | /api/v1/events/{id} | Public | Get event by ID |
| POST | /api/v1/events | Admin | Create event |
| PUT | /api/v1/events/{id} | Admin | Update event |
| DELETE | /api/v1/events/{id} | Admin | Delete event |

### Venues
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/v1/venues | Public | Get all venues |
| GET | /api/v1/venues/{id} | Public | Get venue by ID |
| POST | /api/v1/venues | Admin | Create venue |
| PUT | /api/v1/venues/{id} | Admin | Update venue |
| DELETE | /api/v1/venues/{id} | Admin | Delete venue |

### Bookings
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/v1/bookings | Admin | Get all bookings |
| GET | /api/v1/bookings/user/{userId} | Auth | Get user bookings |
| POST | /api/v1/bookings | Auth | Create booking |
| PUT | /api/v1/bookings/{id}/cancel | Auth | Cancel booking |

### Vendors
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/v1/vendors | Admin | Get all vendors |
| POST | /api/v1/vendors | Admin | Create vendor |
| PUT | /api/v1/vendors/{id} | Admin | Update vendor |
| DELETE | /api/v1/vendors/{id} | Admin | Delete vendor |

### Budgets
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/v1/budgets | Admin | Get all budgets |
| POST | /api/v1/budgets | Admin | Create budget |
| PUT | /api/v1/budgets/{id} | Admin | Update budget |
| DELETE | /api/v1/budgets/{id} | Admin | Delete budget |

## 🗄️ Database Schema (6 Tables)

| Table | Key Columns | Relationships |
|---|---|---|
| users | id, full_name, email, password, role | Has many bookings |
| venues | id, name, address, city, capacity | Has many events |
| events | id, name, event_date, total_seats, venue_id | Belongs to venue, has many bookings |
| bookings | id, number_of_seats, booking_status, user_id, event_id | Belongs to user and event |
| vendors | id, name, service_type, event_id | Linked to event |
| budgets | id, category, allocated_amount, spent_amount, event_id | Linked to event |

## 🖥️ Frontend Pages

| Route | Page | Access |
|---|---|---|
| / | Login Page | Public |
| /register | Register Page | Public |
| /events | Events Listing | Public |
| /events/:id | Event Detail + Booking | Auth |
| /my-bookings | My Bookings | Customer |
| /admin | Admin Dashboard | Admin |
| /admin/events | Manage Events | Admin |
| /admin/venues | Manage Venues | Admin |
| /admin/vendors | Manage Vendors | Admin |
| /admin/bookings | View All Bookings | Admin |
| /admin/budgets | Manage Budgets | Admin |

## 🐳 Docker Setup

| Service | Image | Port |
|---|---|---|
| MySQL | mysql:8.0 | 3307:3306 |
| Backend | Spring Boot (multi-stage Maven build) | 8080:8080 |
| Frontend | React + Nginx | 3000:80 |

## 🧪 Testing

- **Unit Tests:** 8 test cases for BookingService using JUnit 5 + Mockito
- **Test Coverage:** Create booking, overbooking prevention, cancel booking, seat restoration
- **Run tests:** `.\mvnw.cmd test`
- **Result:** All 8 tests pass — BUILD SUCCESS

## 🔒 Security Features

- JWT-based stateless authentication (24-hour token expiry)
- BCrypt password encryption
- Role-based access control (ADMIN / CUSTOMER)
- CORS configured for frontend origins
- Protected API endpoints with Spring Security

## 👩‍💻 Author

**Agrima Saxena**
- GitHub: [agrima150103](https://github.com/agrima150103)
- Project: [EventZen](https://github.com/agrima150103/eventzen-event-management-system)