# 🎟️ EventZen — Event Management System

A full-stack web application for managing events, venues, bookings, vendors and budgets.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Vite + Tailwind CSS |
| Backend | Spring Boot 3.x (Java 17) |
| Database | MySQL |
| Authentication | JWT (JSON Web Token) |
| API Docs | Swagger / OpenAPI |
| Build Tool | Maven |

## 📦 Modules

| Module | Description |
|---|---|
| Auth Module | Register, Login with JWT |
| User Module | Profile management |
| Venue Module | Add, update, delete venues |
| Event Module | Full event lifecycle management |
| Booking Module | Book events, cancel bookings |
| Vendor Module | Manage event vendors |
| Budget Module | Track event budgets and expenses |

## 🚀 How to Run

### Backend
```bash
cd backend
.\mvnw.cmd spring-boot:run
```
Backend runs at: `http://localhost:8080`
Swagger UI: `http://localhost:8080/swagger-ui/index.html`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`

## 🔑 Default Users

| Role | Email | Password |
|---|---|---|
| ADMIN | admin@eventzen.com | admin123 |
| CUSTOMER | agrima@eventzen.com | password123 |

## 📋 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/v1/auth/register | Register new user |
| POST | /api/v1/auth/login | Login and get token |

### Events
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/v1/events | Get all events |
| POST | /api/v1/events | Create event (Admin) |
| PUT | /api/v1/events/{id} | Update event (Admin) |
| DELETE | /api/v1/events/{id} | Delete event (Admin) |

### Venues
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/v1/venues | Get all venues |
| POST | /api/v1/venues | Create venue (Admin) |
| PUT | /api/v1/venues/{id} | Update venue (Admin) |
| DELETE | /api/v1/venues/{id} | Delete venue (Admin) |

### Bookings
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/v1/bookings | Create booking |
| GET | /api/v1/bookings/user/{id} | Get user bookings |
| PUT | /api/v1/bookings/{id}/cancel | Cancel booking |

### Vendors
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/v1/vendors | Get all vendors |
| POST | /api/v1/vendors | Create vendor (Admin) |
| PUT | /api/v1/vendors/{id} | Update vendor (Admin) |
| DELETE | /api/v1/vendors/{id} | Delete vendor (Admin) |

### Budget
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/v1/budgets | Get all budgets |
| POST | /api/v1/budgets | Create budget (Admin) |
| PUT | /api/v1/budgets/{id} | Update budget (Admin) |
| DELETE | /api/v1/budgets/{id} | Delete budget (Admin) |

## 🗄️ Database Schema

Tables:
- `users` — User accounts
- `venues` — Event venues
- `events` — Events linked to venues
- `bookings` — User event bookings
- `vendors` — Event vendors
- `budgets` — Event budgets

## 👩‍💻 Author

Agrima Saxena