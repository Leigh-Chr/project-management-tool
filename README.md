# Project Management Tool

A full-stack web application for project management, featuring a modern Angular frontend and a robust Spring Boot backend.

> **Note**: The backend is currently under development. The frontend application is not yet connected to the backend and runs in standalone mode with mock data.

## Features

- Secure authentication (login/register)
- Complete project management
  - Project creation and deletion
  - Project details (dates, status, description)
  - Member and role management
- Task management
  - Task creation and tracking
  - Project association
- Modern and responsive user interface
- RESTful API with JWT authentication
- Role-based access control

## Prerequisites

- Node.js 20 (LTS version)
- Java 17
- Maven 3.6+
- MySQL 8.0+

## Project Structure

```
project-management-tool/
├── frontend/              # Angular frontend application
│   ├── src/              # Source code
│   ├── public/           # Static files
│   └── docs/             # Frontend documentation
├── backend/              # Spring Boot backend application (under development)
│   ├── src/             # Source code
│   └── docs/            # Backend documentation
└── docs/                # Project documentation
    ├── api-documentation.md
    ├── backend-architecture.md
    ├── database-migrations.md
    ├── data-model.md
    └── features.md
```

## Installation

### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

4. Start the development server:
```bash
npm start
```

The frontend will be available at: `http://localhost:4200`

> **Note**: The frontend currently uses mock data for demonstration purposes. Backend integration will be implemented in a future update.

### Backend

> **Note**: The backend is currently under development. The following instructions will be updated once the backend is ready for use.

1. Navigate to the backend directory:
```bash
cd backend
```

2. Build the application:
```bash
./mvnw clean install
```

3. Start the application:
```bash
./mvnw spring-boot:run
```

The backend API will be available at: `http://localhost:8080`

## Documentation

- [API Documentation](docs/api-documentation.md)
- [Backend Architecture](docs/backend-architecture.md)
- [Database Migrations](docs/database-migrations.md)
- [Data Model](docs/data-model.md)
- [Features](docs/features.md)

## Demo Data

The application comes pre-configured with demo data for testing purposes.

### Available Users

| Username | Email                 | Password   | Notes                     |
|----------|----------------------|------------|---------------------------|
| admin    | admin@example.com    | admin123   | Administrator on all projects |
| alice    | alice@example.com    | alice123   | Member on E-commerce and Backend API |
| bob      | bob@example.com      | bob123     | Member on E-commerce and Mobile App |
| charlie  | charlie@example.com  | charlie123 | Member on Mobile App and Backend API |
| diana    | diana@example.com    | diana123   | Observer on E-commerce and Backend API |

### Demo Projects

- **E-commerce Website**: Development of a modern e-commerce platform with payment integration
- **Mobile App**: Cross-platform mobile application for iOS and Android
- **Backend API**: RESTful API development with microservices architecture

## Testing

### Frontend Tests
```bash
cd frontend
npm run test
```

### Backend Tests
```bash
cd backend
./mvnw test
```
