# Guide de Déploiement Backend - PMT

## Vue d'ensemble

Ce guide couvre le déploiement du backend Spring Boot en local et en production, avec Docker et les meilleures pratiques.

## Déploiement Local

### Démarrage Rapide

```bash
# 1. Démarrage automatique (recommandé)
./start-dev.sh

# 2. Démarrage manuel
docker run -d --name pmt-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=project_management \
  -p 3306:3306 mysql:8.0

./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### Services Locaux

| Service | URL | Credentials |
|---------|-----|-------------|
| **API REST** | http://localhost:8080 | JWT Token |
| **MySQL** | localhost:3306 | root/root |
| **PhpMyAdmin** | http://localhost:8081 | root/root |

### Configuration Développement

#### application-dev.properties
```properties
# Base de données locale
spring.datasource.url=jdbc:mysql://localhost:3306/project_management
spring.datasource.username=root
spring.datasource.password=root

# Logs détaillés
logging.level.com.projectmanagementtool=DEBUG
spring.jpa.show-sql=true

# DevTools
spring.devtools.restart.enabled=true
```

## Déploiement Docker

### Dockerfile Backend

```dockerfile
FROM openjdk:17-jdk-slim

# Metadata
LABEL maintainer="PMT Team"
LABEL description="Project Management Tool Backend"

# Working directory
WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src ./src

# Build application
RUN ./mvnw clean package -DskipTests

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/api/health || exit 1

# Run application
ENTRYPOINT ["java", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"]
```

### Docker Compose Complet

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: pmt-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: project_management
      MYSQL_USER: pmt_user
      MYSQL_PASSWORD: pmt_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10

  backend:
    build: .
    container_name: pmt-backend
    restart: always
    environment:
      SPRING_PROFILES_ACTIVE: prod
      DATABASE_URL: jdbc:mysql://mysql:3306/project_management
      DB_USERNAME: pmt_user
      DB_PASSWORD: pmt_password
      JWT_SECRET: ${JWT_SECRET:-default-secret-change-in-production}
    ports:
      - "8080:8080"
    depends_on:
      mysql:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/api/health"]
      timeout: 10s
      retries: 5

  phpmyadmin:
    image: phpmyadmin/phpmyadmin:latest
    container_name: pmt-phpmyadmin
    restart: always
    environment:
      PMA_HOST: mysql
      PMA_USER: root
      PMA_PASSWORD: root
    ports:
      - "8081:80"
    depends_on:
      mysql:
        condition: service_healthy

volumes:
  mysql_data:
    driver: local

networks:
  default:
    name: pmt-network
```

### Commandes Docker

```bash
# Build de l'image
docker build -t pmt-backend .

# Démarrage complet
docker-compose up -d

# Logs
docker-compose logs -f backend

# Arrêt
docker-compose down

# Nettoyage complet
docker-compose down -v
```

## Déploiement Production

### Variables d'Environnement

#### Variables Obligatoires
```bash
export DATABASE_URL="jdbc:mysql://prod-host:3306/pmt_prod"
export DB_USERNAME="pmt_user"
export DB_PASSWORD="secure_password"
export JWT_SECRET="your-very-secure-jwt-secret-key-256-bits"
export CORS_ORIGINS="https://your-frontend-domain.com"
```

#### Variables Optionnelles
```bash
export PORT=8080
export JWT_EXPIRATION=86400000
export LOG_LEVEL=INFO
```

### application-prod.properties

```properties
# Configuration production
spring.profiles.active=prod
server.port=${PORT:8080}

# Base de données
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

# Pool de connexions optimisé
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000

# JPA Production
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.open-in-view=false

# JWT
jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION:86400000}

# CORS
spring.web.cors.allowed-origins=${CORS_ORIGINS}

# Logs
logging.level.com.projectmanagementtool=INFO
logging.level.org.springframework.security=WARN
logging.level.root=INFO

# Sécurité
server.error.include-message=never
server.error.include-binding-errors=never
```

## Plateformes de Déploiement

### Railway

#### railway.toml
```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "Dockerfile"

[deploy]
startCommand = "java -jar target/backend-0.0.1-SNAPSHOT.jar"
healthcheckPath = "/api/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

[[services]]
name = "pmt-backend"

[services.variables]
SPRING_PROFILES_ACTIVE = "prod"
PORT = "8080"
```

#### Commandes Railway
```bash
# Installation CLI
npm install -g @railway/cli

# Login et déploiement
railway login
railway link
railway up
```

### Heroku

#### Procfile
```
web: java -jar target/backend-0.0.1-SNAPSHOT.jar --server.port=$PORT
```

#### Commandes Heroku
```bash
# Création app
heroku create pmt-backend

# Variables d'environnement
heroku config:set SPRING_PROFILES_ACTIVE=prod
heroku config:set DATABASE_URL=mysql://...
heroku config:set JWT_SECRET=your-secret

# Déploiement
git push heroku main
```

### AWS ECS

#### task-definition.json
```json
{
  "family": "pmt-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "pmt-backend",
      "image": "your-registry/pmt-backend:latest",
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "SPRING_PROFILES_ACTIVE",
          "value": "prod"
        }
      ],
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:8080/api/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3
      }
    }
  ]
}
```

## CI/CD avec GitHub Actions

### .github/workflows/backend.yml

```yaml
name: Backend CI/CD

on:
  push:
    branches: [ main, develop ]
    paths: [ 'backend/**' ]
  pull_request:
    branches: [ main ]
    paths: [ 'backend/**' ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: project_management
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3

    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
        
    - name: Cache Maven packages
      uses: actions/cache@v3
      with:
        path: ~/.m2
        key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}
        
    - name: Run tests
      run: |
        cd backend
        ./mvnw clean test
        
    - name: Generate coverage report
      run: |
        cd backend
        ./mvnw jacoco:report
        
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: backend/target/site/jacoco/jacoco.xml

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
      
    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
        
    - name: Build and push
      uses: docker/build-push-action@v4
      with:
        context: backend
        push: true
        tags: |
          your-registry/pmt-backend:latest
          your-registry/pmt-backend:${{ github.sha }}
```

## Monitoring et Logs

### Configuration des Logs

#### Développement
```properties
# Logs détaillés pour debugging
logging.level.com.projectmanagementtool=DEBUG
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.springframework.security=DEBUG

# Format des logs
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n
```

#### Production
```properties
# Logs optimisés
logging.level.com.projectmanagementtool=INFO
logging.level.org.hibernate=WARN
logging.level.root=INFO

# Logs vers fichier
logging.file.name=logs/application.log
logging.logback.rollingpolicy.max-file-size=100MB
logging.logback.rollingpolicy.total-size-cap=1GB
```

### Health Checks

#### Endpoint de Santé
```java
@RestController
public class HealthController {
    
    @GetMapping("/api/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Application is running");
    }
}
```

#### Vérifications Automatiques
```bash
# Script de monitoring
#!/bin/bash
while true; do
    if curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
        echo "$(date): API is healthy"
    else
        echo "$(date): API is down!"
        # Alertes ou restart automatique
    fi
    sleep 30
done
```

## Sécurité Production

### Configuration SSL/TLS

```properties
# HTTPS (si certificat disponible)
server.ssl.enabled=true
server.ssl.key-store=classpath:keystore.p12
server.ssl.key-store-password=${SSL_PASSWORD}
server.ssl.key-store-type=PKCS12
```

### Variables Sensibles

```bash
# Ne JAMAIS commiter ces valeurs
export JWT_SECRET="your-256-bit-secret-key-very-secure"
export DB_PASSWORD="very-secure-database-password"
export SSL_PASSWORD="ssl-certificate-password"
```

### Recommandations Sécurité

1. **JWT Secret** : Générer une clé de 256 bits minimum
2. **Database** : Utilisateur dédié avec permissions limitées
3. **HTTPS** : Obligatoire en production
4. **Firewall** : Restreindre l'accès aux ports
5. **Updates** : Maintenir les dépendances à jour

## Base de Données Production

### Configuration MySQL Production

```sql
-- Utilisateur dédié
CREATE USER 'pmt_user'@'%' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON project_management.* TO 'pmt_user'@'%';
FLUSH PRIVILEGES;

-- Optimisations
SET GLOBAL innodb_buffer_pool_size = 1G;
SET GLOBAL max_connections = 200;
```

### Backup et Restauration

```bash
# Backup automatique
mysqldump -u pmt_user -p project_management > backup_$(date +%Y%m%d_%H%M%S).sql

# Script de backup quotidien
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u pmt_user -p$DB_PASSWORD project_management > "$BACKUP_DIR/pmt_backup_$DATE.sql"

# Garder seulement les 7 derniers backups
find $BACKUP_DIR -name "pmt_backup_*.sql" -mtime +7 -delete
```

### Migrations Production

```bash
# Validation avant déploiement
./mvnw flyway:validate

# Migration en production
./mvnw flyway:migrate -Dspring.profiles.active=prod

# Information sur l'état
./mvnw flyway:info -Dspring.profiles.active=prod
```

## Performance Production

### Configuration JVM

```bash
# Variables JVM optimisées
export JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseG1GC -XX:MaxGCPauseMillis=200"

# Démarrage avec optimisations
java $JAVA_OPTS -jar target/backend-0.0.1-SNAPSHOT.jar
```

### Pool de Connexions

```properties
# HikariCP optimisé pour production
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000
spring.datasource.hikari.leak-detection-threshold=60000
```

### Métriques et Monitoring

#### Spring Boot Actuator
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

```properties
# Endpoints de monitoring
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=when-authorized
```

#### Endpoints de Monitoring
- `/actuator/health` : Santé de l'application
- `/actuator/metrics` : Métriques JVM et application
- `/actuator/info` : Informations sur l'application

## Déploiement sur Railway

### Configuration Railway

1. **Connexion du Repository**
   ```bash
   railway login
   railway link
   ```

2. **Variables d'Environnement**
   ```bash
   railway variables set SPRING_PROFILES_ACTIVE=prod
   railway variables set JWT_SECRET=your-secret
   railway variables set DATABASE_URL=mysql://...
   ```

3. **Déploiement**
   ```bash
   railway up
   ```

### Base de Données Railway

```bash
# Ajouter MySQL
railway add mysql

# Récupérer l'URL de connexion
railway variables get DATABASE_URL
```

## Déploiement sur AWS

### Elastic Beanstalk

#### .ebextensions/01-mysql.config
```yaml
packages:
  yum:
    mysql: []

option_settings:
  aws:elasticbeanstalk:application:environment:
    SPRING_PROFILES_ACTIVE: prod
    RDS_HOSTNAME: your-rds-endpoint
    RDS_PORT: 3306
    RDS_DB_NAME: project_management
    RDS_USERNAME: pmt_user
    RDS_PASSWORD: secure_password
```

### ECS Fargate

#### docker-compose.prod.yml
```yaml
version: '3.8'
services:
  backend:
    image: your-registry/pmt-backend:latest
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: prod
      DATABASE_URL: ${DATABASE_URL}
      DB_USERNAME: ${DB_USERNAME}
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M
```

## Troubleshooting Déploiement

### Problèmes Courants

#### Base de Données Inaccessible
```bash
# Test de connexion
mysql -h hostname -u username -p database_name

# Vérification réseau
telnet hostname 3306
```

#### Flyway Migration Failed
```bash
# Réparation des checksums
./mvnw flyway:repair -Dspring.profiles.active=prod

# Migration manuelle
./mvnw flyway:migrate -Dspring.profiles.active=prod
```

#### Out of Memory
```bash
# Augmenter la mémoire JVM
export JAVA_OPTS="-Xms1g -Xmx2g"

# Monitoring mémoire
jstat -gc $PID 5s
```

### Scripts de Déploiement

#### deploy.sh
```bash
#!/bin/bash
set -e

echo "🚀 Déploiement Backend PMT"

# Build
echo "📦 Build de l'application..."
./mvnw clean package -DskipTests

# Tests
echo "🧪 Exécution des tests..."
./mvnw test

# Docker build
echo "🐳 Build de l'image Docker..."
docker build -t pmt-backend:latest .

# Deploy
echo "🌐 Déploiement..."
docker-compose up -d backend

echo "✅ Déploiement terminé!"
echo "🌐 API disponible sur: http://localhost:8080"
```

#### health-check.sh
```bash
#!/bin/bash

# Vérification de santé post-déploiement
HEALTH_URL="${1:-http://localhost:8080/api/health}"
MAX_ATTEMPTS=30
ATTEMPT=1

echo "🔍 Vérification de santé: $HEALTH_URL"

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    if curl -f "$HEALTH_URL" > /dev/null 2>&1; then
        echo "✅ Application prête après $ATTEMPT tentatives"
        exit 0
    fi
    
    echo "⏳ Tentative $ATTEMPT/$MAX_ATTEMPTS..."
    sleep 10
    ATTEMPT=$((ATTEMPT + 1))
done

echo "❌ Application non accessible après $MAX_ATTEMPTS tentatives"
exit 1
```

## Maintenance

### Mise à Jour

```bash
# 1. Backup de la base
mysqldump -u user -p project_management > backup_before_update.sql

# 2. Pull du code
git pull origin main

# 3. Build et tests
./mvnw clean test

# 4. Déploiement
docker-compose up -d backend

# 5. Vérification
./health-check.sh
```

### Monitoring Continu

```bash
# Logs en temps réel
docker-compose logs -f backend

# Métriques système
docker stats pmt-backend

# Monitoring base de données
mysql -u root -p -e "SHOW PROCESSLIST;"
```

---

**Références :**
- [Architecture Backend](architecture.md)
- [Guide de Développement](development.md)
- [API Documentation](api.md)
- [Frontend Deployment](../../frontend/docs/deployment.md)
