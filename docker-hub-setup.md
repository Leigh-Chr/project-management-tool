# 🐳 Configuration Docker Hub

## 📋 Prérequis

1. **Compte Docker Hub** : Créer un compte sur [hub.docker.com](https://hub.docker.com)
2. **Secrets GitHub** : Configurer les secrets dans GitHub

## 🔧 Configuration GitHub Secrets

Dans votre repository GitHub, allez dans **Settings > Secrets and variables > Actions** et ajoutez :

```
DOCKER_USERNAME=votre-nom-utilisateur-docker-hub
DOCKER_PASSWORD=votre-mot-de-passe-docker-hub
```

## 🚀 Déploiement Automatique

### 1. Push vers GitHub

```bash
git add .
git commit -m "feat: Docker deployment ready"
git push origin main
```

### 2. GitHub Actions se déclenche automatiquement

La pipeline `.github/workflows/ci-cd.yml` va :
- ✅ Tester le code (Frontend + Backend)
- ✅ Build les images Docker
- ✅ Push vers Docker Hub
- ✅ Scan de sécurité

### 3. Images disponibles sur Docker Hub

```
your-username/pmt-backend:latest
your-username/pmt-frontend:latest
```

## 🏭 Déploiement Production

### Option 1 : Docker Compose

```yaml
version: '3.8'
services:
  backend:
    image: your-username/pmt-backend:latest
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DATABASE_URL=jdbc:mysql://mysql:3306/project_management
    ports:
      - "8080:8080"
  
  frontend:
    image: your-username/pmt-frontend:latest
    ports:
      - "4200:80"
  
  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=root
      - MYSQL_DATABASE=project_management
```

### Option 2 : Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pmt-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: pmt-backend
  template:
    metadata:
      labels:
        app: pmt-backend
    spec:
      containers:
      - name: backend
        image: your-username/pmt-backend:latest
        ports:
        - containerPort: 8080
```

## 📊 Monitoring

### Health Checks

```bash
# Backend
curl http://localhost:8080/api/health

# Frontend
curl http://localhost:4200
```

### Logs

```bash
# Backend logs
docker logs pmt-backend

# Frontend logs  
docker logs pmt-frontend
```

## 🔄 Mise à jour

1. **Code changes** → Push to GitHub
2. **GitHub Actions** → Build & Push new images
3. **Production** → Pull & restart containers

```bash
docker pull your-username/pmt-backend:latest
docker pull your-username/pmt-frontend:latest
docker-compose up -d
```

## 🎯 Avantages de cette approche

- ✅ **100% conforme** à l'énoncé (Docker + CI/CD + Docker Hub)
- ✅ **Automatique** : Push → Build → Deploy
- ✅ **Scalable** : Images prêtes pour Kubernetes
- ✅ **Sécurisé** : Scan de vulnérabilités automatique
- ✅ **Maintenable** : Pipeline reproductible
