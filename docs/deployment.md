# Guide de Déploiement - Project Management Tool

## Vue d'ensemble

Ce guide couvre le déploiement complet de l'application PMT, incluant le frontend Angular et le backend Spring Boot.

## Architecture de Déploiement

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Backend     │    │   Database      │
│   (Angular)     │ -> │  (Spring Boot)  │ -> │    (MySQL)      │
│   Port 4200     │    │   Port 8080     │    │   Port 3306     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         v                       v                       v
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Nginx       │    │   Spring Web    │    │   MySQL 8.0     │
│   (Reverse      │    │   (REST API)    │    │  (Persistence)  │
│    Proxy)       │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Déploiement Local Complet

### Démarrage Rapide

```bash
# 1. Démarrer la base de données
cd backend
docker run -d --name pmt-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=project_management \
  -p 3306:3306 mysql:8.0

# 2. Démarrer le backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# 3. Démarrer le frontend (nouveau terminal)
cd ../frontend
npm install
npm start
```

### Services Locaux

| Service | URL | Port | Credentials |
|---------|-----|------|-------------|
| **Frontend** | http://localhost:4200 | 4200 | - |
| **Backend API** | http://localhost:8080 | 8080 | JWT Token |
| **MySQL** | localhost:3306 | 3306 | root/root |
| **PhpMyAdmin** | http://localhost:8081 | 8081 | root/root |

## Déploiement Docker Complet

### Docker Compose Global

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
    build: ./backend
    container_name: pmt-backend
    restart: always
    environment:
      SPRING_PROFILES_ACTIVE: prod
      DATABASE_URL: jdbc:mysql://mysql:3306/project_management
      DB_USERNAME: pmt_user
      DB_PASSWORD: pmt_password
      JWT_SECRET: ${JWT_SECRET:-change-me-in-production}
      CORS_ORIGINS: http://localhost:80,http://localhost:4200
    ports:
      - "8080:8080"
    depends_on:
      mysql:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/api/health"]
      timeout: 10s
      retries: 5

  frontend:
    build: ./frontend
    container_name: pmt-frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      backend:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80"]
      timeout: 10s
      retries: 3

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

### Commandes Docker Globales

```bash
# Démarrage complet
docker-compose up -d

# Logs de tous les services
docker-compose logs -f

# Arrêt complet
docker-compose down

# Nettoyage complet (attention : supprime les données)
docker-compose down -v
```

## Déploiement Production

### Variables d'Environnement Globales

```bash
# Base de données
export DATABASE_URL="jdbc:mysql://prod-host:3306/pmt_prod"
export DB_USERNAME="pmt_user"
export DB_PASSWORD="secure_password"

# Backend
export JWT_SECRET="your-very-secure-jwt-secret-256-bits"
export BACKEND_URL="https://api.yourapp.com"

# Frontend
export FRONTEND_URL="https://yourapp.com"
export API_BASE_URL="https://api.yourapp.com/api"

# CORS
export CORS_ORIGINS="https://yourapp.com,https://www.yourapp.com"
```

### Plateformes de Déploiement

#### Railway (Recommandé)

**Backend** :
```bash
cd backend
railway login
railway link
railway variables set SPRING_PROFILES_ACTIVE=prod
railway variables set DATABASE_URL=mysql://...
railway up
```

**Frontend** :
```bash
cd frontend
railway login
railway link
railway variables set API_BASE_URL=https://your-backend.railway.app/api
railway up
```

#### Vercel + Railway

**Frontend (Vercel)** :
```bash
cd frontend
vercel --prod
vercel env add API_BASE_URL https://your-backend.railway.app/api
```

**Backend (Railway)** :
```bash
cd backend
railway up
```

#### AWS (Architecture Complète)

**Infrastructure** :
- **Frontend** : S3 + CloudFront
- **Backend** : ECS Fargate
- **Database** : RDS MySQL
- **Load Balancer** : ALB

## Configuration des Environnements

### Développement

#### Backend
```properties
# application-dev.properties
spring.datasource.url=jdbc:mysql://localhost:3306/project_management
spring.web.cors.allowed-origins=http://localhost:4200
```

#### Frontend
```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

### Production

#### Backend
```properties
# application-prod.properties
spring.datasource.url=${DATABASE_URL}
spring.web.cors.allowed-origins=${CORS_ORIGINS}
```

#### Frontend
```typescript
// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.yourapp.com/api'
};
```

## CI/CD Pipeline Complète

### GitHub Actions

```yaml
name: Full Stack CI/CD

on:
  push:
    branches: [ main ]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: project_management
        ports:
          - 3306:3306
    steps:
    - uses: actions/checkout@v3
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
    - name: Test Backend
      run: |
        cd backend
        ./mvnw clean test jacoco:report

  test-frontend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
    - name: Test Frontend
      run: |
        cd frontend
        npm ci
        npm run test:coverage
        npm run lint

  build-and-deploy:
    needs: [test-backend, test-frontend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    
    # Build Backend
    - name: Build Backend Docker
      run: |
        cd backend
        docker build -t pmt-backend:latest .
        
    # Build Frontend
    - name: Build Frontend Docker
      run: |
        cd frontend
        docker build -t pmt-frontend:latest .
        
    # Deploy to production
    - name: Deploy to Railway
      run: |
        # Scripts de déploiement
```

## Monitoring Global

### Health Checks

```bash
# Script de vérification complète
#!/bin/bash
echo "🔍 Vérification de l'infrastructure PMT"

# Frontend
if curl -f http://localhost:4200 > /dev/null 2>&1; then
    echo "✅ Frontend: OK"
else
    echo "❌ Frontend: DOWN"
fi

# Backend API
if curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
    echo "✅ Backend API: OK"
else
    echo "❌ Backend API: DOWN"
fi

# Base de données
if mysql -u root -proot -e "SELECT 1" > /dev/null 2>&1; then
    echo "✅ MySQL: OK"
else
    echo "❌ MySQL: DOWN"
fi
```

### Logs Centralisés

```bash
# Logs de tous les services
docker-compose logs -f

# Logs spécifiques
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f mysql
```

## Sécurité Globale

### HTTPS Configuration

#### Nginx (Frontend)
```nginx
server {
    listen 443 ssl;
    server_name yourapp.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://backend:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Variables Sensibles

```bash
# Ne JAMAIS commiter ces valeurs
export JWT_SECRET="your-256-bit-secret"
export DB_PASSWORD="secure-db-password"
export SSL_CERT_PASSWORD="ssl-password"
```

## Backup et Restauration

### Backup Complet

```bash
#!/bin/bash
BACKUP_DIR="/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# Backup base de données
mysqldump -u root -p project_management > "$BACKUP_DIR/database.sql"

# Backup configuration
cp -r backend/src/main/resources "$BACKUP_DIR/backend-config"
cp -r frontend/src/environments "$BACKUP_DIR/frontend-config"

# Backup Docker configs
cp docker-compose.yml "$BACKUP_DIR/"
cp backend/Dockerfile "$BACKUP_DIR/backend-Dockerfile"
cp frontend/Dockerfile "$BACKUP_DIR/frontend-Dockerfile"

echo "✅ Backup complet dans $BACKUP_DIR"
```

### Restauration

```bash
#!/bin/bash
BACKUP_DIR="$1"

if [ -z "$BACKUP_DIR" ]; then
    echo "Usage: ./restore.sh /path/to/backup"
    exit 1
fi

# Restaurer la base
mysql -u root -p project_management < "$BACKUP_DIR/database.sql"

# Redémarrer les services
docker-compose restart

echo "✅ Restauration terminée"
```

## Troubleshooting Global

### Problèmes Courants

#### Frontend ne se connecte pas au Backend
```bash
# Vérifier CORS
curl -H "Origin: http://localhost:4200" \
  -H "Access-Control-Request-Method: GET" \
  -X OPTIONS http://localhost:8080/api/projects

# Vérifier les variables d'environnement
echo $API_BASE_URL
```

#### Base de données inaccessible
```bash
# Test de connexion
mysql -h localhost -u root -p project_management

# Vérifier les conteneurs
docker ps | grep mysql
docker logs pmt-mysql
```

#### Problèmes de performance
```bash
# Monitoring des ressources
docker stats

# Logs de performance
grep "took" backend/spring-boot.log
```

## Scripts Utiles

### start-all.sh
```bash
#!/bin/bash
echo "🚀 Démarrage complet PMT"

# Vérifier Docker
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker requis"
    exit 1
fi

# Démarrer l'infrastructure
echo "📦 Démarrage infrastructure..."
docker-compose up -d mysql

# Attendre MySQL
echo "⏳ Attente MySQL..."
until docker-compose exec mysql mysqladmin ping -h "localhost" --silent; do
    sleep 2
done

# Démarrer backend
echo "⚙️ Démarrage backend..."
cd backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev &
BACKEND_PID=$!

# Attendre backend
echo "⏳ Attente backend..."
until curl -f http://localhost:8080/api/health > /dev/null 2>&1; do
    sleep 2
done

# Démarrer frontend
echo "🎨 Démarrage frontend..."
cd ../frontend && npm start &
FRONTEND_PID=$!

echo "🎉 Application complète démarrée!"
echo "🌐 Frontend: http://localhost:4200"
echo "⚙️ Backend: http://localhost:8080"
echo "🗄️ PhpMyAdmin: http://localhost:8081"

# Garder les PIDs pour arrêt propre
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid
```

### stop-all.sh
```bash
#!/bin/bash
echo "🛑 Arrêt complet PMT"

# Arrêter les processus
if [ -f .backend.pid ]; then
    kill $(cat .backend.pid) 2>/dev/null
    rm .backend.pid
fi

if [ -f .frontend.pid ]; then
    kill $(cat .frontend.pid) 2>/dev/null  
    rm .frontend.pid
fi

# Arrêter Docker
docker-compose down

echo "✅ Arrêt terminé"
```

---

**Références :**
- [Frontend Deployment](../frontend/docs/deployment.md)
- [Backend Deployment](../backend/docs/deployment.md)
- [Data Model](data-model.md)
- [API Contract](api-contract.md)
