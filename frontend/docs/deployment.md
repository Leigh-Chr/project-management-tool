# Guide de Déploiement

## Vue d'ensemble

Ce guide couvre les différentes méthodes de déploiement du projet PMT, de l'environnement de développement à la production.

## Environnements

### Développement
- **URL** : `http://localhost:4200`
- **API** : `http://localhost:8080/api`
- **Mode** : Hot reload activé

### Production
- **URL** : `https://your-domain.com`
- **API** : `https://api.your-domain.com`
- **Mode** : Optimisé et minifié

## Déploiement Local

### Prérequis

```bash
# Vérifier les versions
node --version  # >= 20.0.0
npm --version   # >= 10.0.0
```

### Installation

```bash
# Cloner le repository
git clone <repository-url>
cd project-management-tool/frontend

# Installer les dépendances
npm install

# Démarrer en mode développement
npm start
```

### Build de Production

```bash
# Build optimisé
npm run build

# Vérifier le build
ls -la dist/project-management-tool/browser/
```

## Déploiement avec Docker

### Dockerfile

Le projet utilise un build multi-stage optimisé :

```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Build application
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /usr/src/app/dist/project-management-tool/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Construction de l'Image

```bash
# Build de l'image
docker build -t pmt-frontend:latest .

# Vérifier l'image
docker images pmt-frontend

# Tester localement
docker run -p 80:80 pmt-frontend:latest
```

### Docker Compose

```yaml
version: "3.8"
services:
  angular-app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

```bash
# Démarrage avec Docker Compose
docker-compose up --build -d

# Vérification
docker-compose ps
docker-compose logs -f
```

## Configuration Nginx

### nginx.conf

```nginx
worker_processes auto;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    sendfile on;
    keepalive_timeout 65;

    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # SPA routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Static assets caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Error handling
        error_page 404 /index.html;
    }
}
```

### Optimisations

- **Compression Gzip** : Réduction de la taille des assets
- **Cache des Assets** : Expiration 1 an pour les fichiers statiques
- **SPA Routing** : Redirection vers index.html pour les routes Angular
- **Headers de Sécurité** : Configuration sécurisée

## Variables d'Environnement

### environment.ts (Développement)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  logLevel: 'debug',
  featureFlag: true,
};
```

### environment.prod.ts (Production)

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.your-domain.com',
  logLevel: 'error',
  featureFlag: false,
};
```

### Configuration Dynamique

Pour une configuration dynamique en production :

```typescript
// config.service.ts
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any = {};

  async loadConfig(): Promise<void> {
    const response = await fetch('/assets/config.json');
    this.config = await response.json();
  }

  get apiUrl(): string {
    return this.config.apiUrl || 'http://localhost:8080/api';
  }
}
```

## Déploiement sur Railway

### Configuration Railway

Le fichier `railway.toml` configure le déploiement :

```toml
[build]
builder = "DOCKERFILE"

[deploy]
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 10
```

### Déploiement

```bash
# Installation de Railway CLI
npm install -g @railway/cli

# Connexion
railway login

# Déploiement
railway up
```

### Variables d'Environnement Railway

```bash
# Configuration des variables
railway variables set NODE_ENV=production
railway variables set API_URL=https://api.your-domain.com
```

## Déploiement sur AWS

### S3 + CloudFront

```bash
# Installation AWS CLI
aws configure

# Upload vers S3
aws s3 sync dist/project-management-tool/browser/ s3://your-bucket-name --delete

# Invalidation CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### ECS avec Fargate

```yaml
# task-definition.json
{
  "family": "pmt-frontend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "pmt-frontend",
      "image": "your-account.dkr.ecr.region.amazonaws.com/pmt-frontend:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "essential": true
    }
  ]
}
```

## Déploiement sur Vercel

### Configuration

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/project-management-tool/browser"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Déploiement

```bash
# Installation Vercel CLI
npm install -g vercel

# Déploiement
vercel --prod
```

## CI/CD avec GitHub Actions

### Workflow de Déploiement

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test -- --coverage --watch=false
    
    - name: Build application
      run: npm run build
    
    - name: Build Docker image
      run: docker build -t pmt-frontend:${{ github.sha }} .
    
    - name: Push to registry
      run: |
        echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
        docker push pmt-frontend:${{ github.sha }}
    
    - name: Deploy to production
      run: |
        # Déploiement vers votre plateforme
        echo "Deploying to production..."
```

## Monitoring et Logs

### Health Checks

```typescript
// health.service.ts
@Injectable({
  providedIn: 'root'
})
export class HealthService {
  checkHealth(): Observable<boolean> {
    return this.http.get<{status: string}>('/api/health').pipe(
      map(response => response.status === 'ok'),
      catchError(() => of(false))
    );
  }
}
```

### Logging

```typescript
// logger.service.ts
@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  log(level: string, message: string, data?: any): void {
    if (environment.production) {
      // Envoi vers service de logging externe
      this.sendToExternalLogger(level, message, data);
    } else {
      console.log(`[${level}] ${message}`, data);
    }
  }
}
```

## Sécurité

### Headers de Sécurité

```nginx
# nginx.conf
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
```

### HTTPS

```nginx
# Configuration HTTPS
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Redirection HTTP vers HTTPS
    if ($scheme != "https") {
        return 301 https://$host$request_uri;
    }
}
```

## Performance

### Optimisations Build

Les budgets sont déjà configurés dans `angular.json` :

```json
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "500kB",
    "maximumError": "1MB"
  },
  {
    "type": "anyComponentStyle",
    "maximumWarning": "2kB",
    "maximumError": "4kB"
  }
]
```

### Bundle Analysis

```bash
# Analyse du bundle
npm run build -- --stats-json
npx webpack-bundle-analyzer dist/project-management-tool/stats.json
```

## Dépannage

### Problèmes Courants

1. **Build échoue**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Erreur de mémoire**
   ```bash
   export NODE_OPTIONS="--max-old-space-size=4096"
   npm run build
   ```

3. **Problème Docker**
   ```bash
   docker system prune -a
   docker-compose down -v
   docker-compose up --build
   ```

### Logs de Débogage

```bash
# Logs Docker
docker logs <container-id>

# Logs Nginx
docker exec <container-id> tail -f /var/log/nginx/error.log

# Logs de l'application
docker exec <container-id> tail -f /var/log/nginx/access.log
```

## Rollback

### Stratégie de Rollback

```bash
# Rollback Docker
docker tag pmt-frontend:previous pmt-frontend:latest
docker-compose up -d

# Rollback S3
aws s3 sync s3://your-bucket-name/previous/ s3://your-bucket-name/ --delete

# Rollback avec Git
git revert <commit-hash>
git push origin main
```

---

**Références :**
- [Architecture](architecture.md)
- [Guide de développement](development.md)
- [API Documentation](api.md)
