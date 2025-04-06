# Project Management Tool

Web application for project management developed with Angular 19.

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

## Prerequisites

- Node.js 20 (LTS version)
- npm
- Docker

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Leigh-Chr/project-management-tool
cd project-management-tool
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

4. Start the application:
```bash
npm start
```

The application will be available at: `http://localhost:4200`

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

### Available Statuses

- To Do
- In Progress
- Done

### Available Roles

- Admin
- Member
- Observer

## Build & Deployment

Build for production:
```bash
npm run build
```

Deploy with Docker:
```bash
docker-compose up -d
```

The application will be available at: `http://localhost:80`

## Tests

```bash
npm run test
```

## Project Structure

```
project-management-tool/
├── src/                    # Source code
│   ├── app/               # Application
│   │   ├── core/         # Core services
│   │   ├── shared/       # Reusable content
│   │   ├── pages/        # Pages
│   │   ├── interceptors/ # HTTP interceptors
│   │   └── styles/       # Specific styles
│   ├── environments/      # Configuration
│   └── assets/           # Resources
├── public/                # Static files
└── docs/                  # Documentation
```
