# Project Management Tool - Backend

This is the backend service for the Project Management Tool, built with Spring Boot.

## Technologies Used

- Java 17
- Spring Boot 3.x
- Spring Security with JWT
- Spring Data JPA
- MySQL
- Flyway for database migrations
- Maven

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher

## Configuration

The application can be configured through the following properties files:

- `application.properties`: Default configuration
- `application-local.properties`: Local development configuration
- `application-dev.properties`: Development environment configuration
- `application-prod.properties`: Production environment configuration

### Database Configuration

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/project_management
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### JWT Configuration

```properties
jwt.secret=your_jwt_secret
jwt.expiration=86400000
```

## Building the Application

```bash
mvn clean install
```

## Running the Application

```bash
mvn spring-boot:run
```

The application will be available at `http://localhost:8080/api`

## API Documentation

For detailed API documentation, see [API Documentation](../docs/api-documentation.md)

## Project Structure

```
src/
├── main/
│   ├── java/
│   │   └── com/
│   │       └── projectmanagementtool/
│   │           ├── config/
│   │           ├── controller/
│   │           ├── model/
│   │           ├── repository/
│   │           ├── service/
│   │           ├── dto/
│   │           ├── mapper/
│   │           ├── security/
│   │           ├── exception/
│   │           └── util/
│   └── resources/
│       ├── application.properties
│       └── db/
│           └── migration/
```

## Database Migrations

Database migrations are managed using Flyway. Migration scripts are located in `src/main/resources/db/migration/`.

## Security

The application uses JWT-based authentication. All endpoints except `/api/auth/login` and `/api/auth/register` require authentication.

## Testing

```bash
mvn test
```

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request 