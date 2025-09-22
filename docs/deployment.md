# Guide de Déploiement Railway - Project Management Tool

## Vue d'ensemble

Ce guide couvre le déploiement automatique de l'application PMT sur Railway, incluant le frontend Angular et le backend Spring Boot.

## 🚀 Déploiement Railway

### Configuration Railway

1. **Connecter le repository** à Railway
2. **Railway détecte automatiquement** :
   - Backend : Maven (`pom.xml`)
   - Frontend : npm (`package.json`)
   - Base de données : MySQL automatique

### Variables d'Environnement Railway

| Variable | Valeur | Description |
|----------|--------|-------------|
| `SPRING_PROFILES_ACTIVE` | `prod` | Profil Spring Boot |
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://...` | URL MySQL Railway |
| `SPRING_DATASOURCE_USERNAME` | `root` | Utilisateur MySQL |
| `SPRING_DATASOURCE_PASSWORD` | `...` | Mot de passe MySQL |
| `JWT_SECRET` | `...` | Clé secrète JWT |

## 🛠️ Démarrage Local (Développement)

### Prérequis

- **Node.js** 20+ et **npm**
- **Java** 17+ et **Maven**
- **MySQL** 8.0+

### Démarrage

```bash
# Terminal 1 : Backend
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Terminal 2 : Frontend
cd frontend
npm install
npm start
```

### Services Locaux

| Service | URL | Port | Credentials |
|---------|-----|------|-------------|
| **Frontend** | http://localhost:4200 | 4200 | - |
| **Backend API** | http://localhost:8080 | 8080 | JWT Token |
| **Database** | localhost:3306 | 3306 | root/root |

### Connexion par défaut

- **Email** : alice@example.com
- **Mot de passe** : alice123

## 🧪 Tests d'Intégration

### Script de Test

```bash
# Tester l'intégration complète
./test-integration.sh
```

### Tests Manuels

1. **Authentification** : Login avec alice@example.com
2. **Projets** : Création et gestion des projets
3. **Tâches** : Création et assignation des tâches
4. **Membres** : Gestion des rôles et permissions

## 📋 Checklist de Déploiement

### Avant Railway

- [ ] Repository GitHub configuré
- [ ] Variables d'environnement préparées
- [ ] Tests locaux réussis
- [ ] Documentation à jour

### Après Railway

- [ ] Application accessible
- [ ] Base de données connectée
- [ ] Authentification fonctionnelle
- [ ] Tests d'intégration réussis

## 🔧 Dépannage

### Problèmes Courants

1. **Base de données** : Vérifier les variables d'environnement
2. **CORS** : Configuration Spring Security
3. **JWT** : Vérifier la clé secrète
4. **Build** : Vérifier les dépendances Maven/npm

### Logs Railway

- **Backend** : Logs Spring Boot dans Railway
- **Frontend** : Logs npm dans Railway
- **Base de données** : Logs MySQL dans Railway

## 📚 Documentation Complémentaire

- **Architecture** : [`docs/architecture.md`](architecture.md)
- **API** : [`docs/api-contract.md`](api-contract.md)
- **Modèle de données** : [`docs/data-model.md`](data-model.md)