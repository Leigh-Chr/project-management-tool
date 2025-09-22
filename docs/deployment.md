# 🚀 Guide de Déploiement - Project Management Tool

## Vue d'ensemble

Ce guide couvre le déploiement de l'application PMT avec **Docker** et **GitHub Actions**.

## 🐳 Déploiement avec Docker

### Déploiement Local

```bash
# 1. Cloner le projet
git clone https://github.com/Leigh-Chr/project-management-tool.git
cd project-management-tool

# 2. Construire les images
cd backend && ./mvnw clean package -DskipTests && cd ..
cd frontend && npm ci && npm run build && cd ..

# 3. Démarrer avec Docker Compose
docker-compose up -d
```

### Déploiement avec Scripts

```bash
# Déploiement simple
./deploy-simple.sh

# Arrêter l'application
./stop.sh
```

## 🔄 CI/CD avec GitHub Actions

### Configuration

1. **Secrets GitHub** (Settings > Secrets and variables > Actions) :
   - `DOCKER_USERNAME` : Votre nom d'utilisateur Docker Hub
   - `DOCKER_PASSWORD` : Votre mot de passe Docker Hub

2. **Pipeline automatique** :
   - Build Backend (Maven)
   - Build Frontend (npm)
   - Push vers Docker Hub

### Images Docker Hub

- `leigh-chr/pmt-backend:latest`
- `leigh-chr/pmt-frontend:latest`

## 🌐 Accès à l'Application

| Service | URL | Port | Description |
|---------|-----|------|-------------|
| **Frontend** | http://localhost:4200 | 4200 | Interface Angular |
| **Backend API** | http://localhost:8080 | 8080 | API Spring Boot |
| **Database** | localhost:3306 | 3306 | MySQL |

## 👤 Comptes de Test

| Email | Password | Rôle |
|-------|----------|------|
| admin@example.com | admin123 | Admin |
| alice@example.com | alice123 | Member |
| bob@example.com | bob123 | Member |

## 🔧 Commandes Utiles

```bash
# Voir les logs
docker-compose logs -f

# Redémarrer un service
docker-compose restart backend

# Arrêter l'application
docker-compose down

# Nettoyer (supprimer volumes)
docker-compose down -v
```

## 📋 Checklist de Déploiement

### Avant Déploiement
- [ ] Docker installé
- [ ] Java 17 et Node.js 20
- [ ] Variables d'environnement configurées
- [ ] Tests locaux réussis

### Après Déploiement
- [ ] Application accessible
- [ ] Base de données connectée
- [ ] Authentification fonctionnelle
- [ ] Tests d'intégration réussis

## 🛠️ Dépannage

### Problèmes Courants

1. **Port déjà utilisé** : Changer les ports dans `docker-compose.yml`
2. **Base de données** : Vérifier les variables d'environnement
3. **CORS** : Configuration Spring Security
4. **Build** : Vérifier les dépendances Maven/npm

### Logs

```bash
# Logs backend
docker logs pmt-backend

# Logs frontend
docker logs pmt-frontend

# Logs base de données
docker logs pmt-mysql
```

## 📚 Documentation Complémentaire

- **Architecture** : [`docs/architecture.md`](architecture.md)
- **API** : [`docs/api-contract.md`](api-contract.md)
- **Modèle de données** : [`docs/data-model.md`](data-model.md)