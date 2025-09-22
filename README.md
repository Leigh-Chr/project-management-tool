# 🚀 Project Management Tool (PMT)

Application de gestion de projet collaboratif développée avec **Angular** et **Spring Boot**.

## 📋 Prérequis

- **Docker** et **Docker Compose**
- **Java 17** (pour le développement)
- **Node.js 20** (pour le développement)

> **Note** : Node.js v21 fonctionne mais génère des warnings. Node.js v20 est recommandé.

## 🚀 Déploiement Simple

### 1. Cloner le projet
```bash
git clone https://github.com/Leigh-Chr/project-management-tool.git
cd project-management-tool
```

### 2. Construire les images Docker
```bash
# Backend
cd backend
./mvnw clean package -DskipTests
cd ..

# Frontend  
cd frontend
npm ci
npm run build
cd ..
```

### 3. Démarrer l'application
```bash
docker-compose up -d
```

### 4. Accéder à l'application
- **Frontend** : http://localhost:4200
- **Backend API** : http://localhost:8080
- **Base de données** : localhost:3306

## 🛠️ Développement

### Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend (Angular)
```bash
cd frontend
npm start
```

## 🐳 Docker Hub

Les images sont automatiquement publiées sur Docker Hub :
- `leigh-chr/pmt-backend:latest`
- `leigh-chr/pmt-frontend:latest`

## 📊 Comptes de test

| Email | Password | Rôle |
|-------|----------|------|
| admin@example.com | admin123 | Admin |
| alice@example.com | alice123 | Member |
| bob@example.com | bob123 | Member |

## 🔧 Commandes utiles

```bash
# Déploiement simple
./deploy-simple.sh

# Arrêter l'application
./stop.sh

# Avec Docker Compose
docker-compose up -d
docker-compose logs -f
docker-compose down
```

## 📁 Structure du projet

```
project-management-tool/
├── backend/          # Spring Boot API
├── frontend/         # Angular SPA
├── docker-compose.yml
└── README.md
```

## ✅ Conformité

- ✅ **Dockerisation** : Frontend + Backend
- ✅ **CI/CD** : GitHub Actions
- ✅ **Docker Hub** : Publication automatique
- ✅ **Documentation** : README complet