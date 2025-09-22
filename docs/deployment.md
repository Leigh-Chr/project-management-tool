# Guide de Déploiement Railway - Project Management Tool

## Vue d'ensemble

Ce guide couvre le déploiement automatique de l'application PMT sur Railway, incluant le frontend Angular et le backend Spring Boot.

## 🚀 Déploiement Railway Monorepo

### ⚠️ Configuration Monorepo

Railway ne peut pas gérer automatiquement un monorepo. Il faut créer **2 projets Railway séparés** :

#### **1️⃣ Service Backend**
1. **Créer un nouveau projet Railway** : "PMT-Backend"
2. **Connecter le repository** GitHub
3. **Configurer le Root Directory** : `backend`
4. **Railway détecte automatiquement** Maven via `pom.xml`
5. **Ajouter MySQL** au projet Backend

#### **2️⃣ Service Frontend**
1. **Créer un nouveau projet Railway** : "PMT-Frontend"
2. **Connecter le même repository** GitHub
3. **Configurer le Root Directory** : `frontend`
4. **Railway détecte automatiquement** npm via `package.json`

### 🔧 Configuration Railway

Les fichiers `railway.toml` sont déjà configurés :
- **Root** : `railway.toml` (détection monorepo)
- **Backend** : `backend/railway.toml` (Spring Boot)
- **Frontend** : `frontend/railway.toml` (Angular)

### Variables d'Environnement Railway

#### **Backend Railway :**
| Variable | Valeur | Description |
|----------|--------|-------------|
| `SPRING_PROFILES_ACTIVE` | `prod` | Profil Spring Boot |
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://[RAILWAY_MYSQL_URL]` | URL MySQL Railway |
| `SPRING_DATASOURCE_USERNAME` | `[RAILWAY_MYSQL_USER]` | Utilisateur MySQL Railway |
| `SPRING_DATASOURCE_PASSWORD` | `[RAILWAY_MYSQL_PASSWORD]` | Mot de passe MySQL Railway |
| `JWT_SECRET` | `[GENERATE_SECRET_KEY]` | Clé secrète JWT (générer une clé forte) |

#### **Frontend Railway :**
| Variable | Valeur | Description |
|----------|--------|-------------|
| `NODE_ENV` | `production` | Environnement Node.js |
| `API_URL` | `https://[BACKEND_RAILWAY_URL]/api` | URL de l'API Backend |

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

## 🧪 Tests de Configuration

### Test de Configuration Railway

```bash
# Tester que la configuration Railway est prête
./test-railway-config.sh
```

### Tests d'Intégration

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