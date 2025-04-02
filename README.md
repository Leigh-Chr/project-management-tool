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
| alice    | alice@example.com    | alicePass  | Administrateur on Project Beta |
| bob      | bob@example.com      | bobPass    | Administrateur on Project Gamma |
| charlie  | charlie@example.com  | charliePass| Membre on Project Beta    |
| diana    | diana@example.com    | dianaPass  | Observateur on Project Beta  |
| eve      | eve@example.com      | evePass    | Administrateur on Project Delta |
| frank    | frank@example.com    | frankPass  | Administrateur on Project Alpha |
| grace    | grace@example.com    | gracePass  | Administrateur on Project Epsilon |
| henry    | henry@example.com    | henryPass  | Membre on Project Alpha   |

### Demo Projects

- **Project Alpha**: Frontend redesign project for the customer portal
- **Project Beta**: Backend API development with microservices
- **Project Gamma**: Mobile application development for iOS/Android
- **Project Delta**: Database migration and optimization project
- **Project Epsilon**: Infrastructure modernization with AWS migration

### Available Statuses

- To Do
- In Progress
- Done

### Available Roles

- Administrator
- Member
- Observator

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
