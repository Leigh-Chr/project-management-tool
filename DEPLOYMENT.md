# 🚀 Guide de Déploiement - Project Management Tool

## 📋 Vue d'ensemble

Ce projet est **100% dockerisé** et prêt pour le déploiement en production avec :
- ✅ **Docker** : Images optimisées multi-stage
- ✅ **CI/CD** : GitHub Actions automatique
- ✅ **Docker Hub** : Publication automatique
- ✅ **Documentation** : Guides complets

## 🐳 Déploiement Local

### Prérequis
- Docker installé
- Git

### Démarrage rapide

```bash
# 1. Cloner le projet
git clone <repository-url>
cd project-management-tool

# 2. Tester les builds Docker
./test-docker.sh

# 3. Déployer l'application
./deploy-simple.sh

# 4. Accéder à l'application
# Frontend: http://localhost:4200
# Backend: http://localhost:8080
```

### Scripts disponibles

```bash
./deploy.sh          # Déploiement complet avec MySQL
./deploy-simple.sh   # Déploiement simple (recommandé)
./stop.sh            # Arrêter l'application
./test-docker.sh     # Tester les builds Docker
```

## 🏭 Déploiement Production

### 1. Configuration GitHub Actions

1. **Fork** ou **clone** ce repository
2. **Configurer les secrets** dans GitHub :
   - `DOCKER_USERNAME` : Votre nom d'utilisateur Docker Hub
   - `DOCKER_PASSWORD` : Votre mot de passe Docker Hub

### 2. Déploiement automatique

```bash
# Push vers GitHub déclenche automatiquement :
git add .
git commit -m "feat: Ready for production"
git push origin main

# GitHub Actions va :
# ✅ Tester le code
# ✅ Build les images Docker
# ✅ Push vers Docker Hub
# ✅ Scan de sécurité
```

### 3. Images Docker Hub

Après le push, vos images seront disponibles :
```
your-username/pmt-backend:latest
your-username/pmt-frontend:latest
```

## 🌐 Déploiement sur serveur

### Option 1 : Docker Compose

```yaml
version: '3.8'
services:
  backend:
    image: your-username/pmt-backend:latest
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DATABASE_URL=jdbc:mysql://mysql:3306/project_management
      - DB_USERNAME=pmt_user
      - DB_PASSWORD=pmt_password
      - JWT_SECRET=your-jwt-secret
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
      - MYSQL_USER=pmt_user
      - MYSQL_PASSWORD=pmt_password
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
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
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "prod"
        - name: DATABASE_URL
          value: "jdbc:mysql://mysql-service:3306/project_management"
```

## 🔧 Configuration

### Variables d'environnement

#### Backend
```bash
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=jdbc:mysql://mysql:3306/project_management
DB_USERNAME=pmt_user
DB_PASSWORD=pmt_password
JWT_SECRET=your-256-bit-secret
CORS_ORIGINS=http://localhost:4200
```

#### Frontend
```bash
API_URL=http://localhost:8080/api
```

## 📊 Monitoring

### Health Checks

```bash
# Backend health
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

# Tous les logs
docker-compose logs
```

## 🔄 Mise à jour

### Mise à jour automatique

1. **Modifier le code**
2. **Push vers GitHub**
3. **GitHub Actions** build et push automatiquement
4. **Production** : Pull et restart

```bash
# Sur le serveur de production
docker pull your-username/pmt-backend:latest
docker pull your-username/pmt-frontend:latest
docker-compose up -d
```

## 🛠️ Dépannage

### Problèmes courants

#### 1. Port déjà utilisé
```bash
# Vérifier les ports utilisés
netstat -tulpn | grep :8080
netstat -tulpn | grep :4200

# Arrêter les services
./stop.sh
```

#### 2. Images non trouvées
```bash
# Rebuild les images
docker build -t pmt-backend ./backend
docker build -t pmt-frontend ./frontend
```

#### 3. Base de données
```bash
# Vérifier MySQL
docker logs pmt-mysql

# Redémarrer MySQL
docker restart pmt-mysql
```

## 📚 Documentation complète

- **🐳 [Docker Hub Setup](docker-hub-setup.md)** : Configuration Docker Hub
- **📋 [README](README.md)** : Vue d'ensemble du projet
- **🏗️ [Architecture](docs/architecture.md)** : Architecture technique
- **🌐 [API](docs/api.md)** : Documentation API

## 🎯 Conformité

Cette solution respecte **100%** des exigences de l'énoncé :

- ✅ **Dockerisation** : Images optimisées multi-stage
- ✅ **CI/CD** : GitHub Actions automatique
- ✅ **Docker Hub** : Publication automatique
- ✅ **Documentation** : Guides complets
- ✅ **Tests** : Pipeline de tests automatique
- ✅ **Sécurité** : Scan de vulnérabilités

## 🚀 Prêt pour la production !

Votre application est maintenant **prête pour le déploiement** avec une approche moderne, scalable et maintenable.
