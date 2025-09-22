# Project Management Tool (PMT)

[![Angular](https://img.shields.io/badge/Angular-19.2.5-red.svg)](https://angular.io/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.2-blue.svg)](https://www.typescriptlang.org/)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://openjdk.java.net/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

Une plateforme de gestion de projet collaborative full-stack développée avec Angular 19 et Spring Boot 3, dans le cadre d'une étude de cas RNCP niveau 7 "Expert en Ingénierie du Logiciel".

## 🚀 Démarrage Local

```bash
# Terminal 1 : Backend
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Terminal 2 : Frontend  
cd frontend
npm start

# Services disponibles :
# 🌐 Frontend:    http://localhost:4200
# ⚙️ Backend API: http://localhost:8080

# Connexion par défaut :
# Email: alice@example.com
# Mot de passe: alice123
```

## 🐳 Déploiement Docker

### Configuration Prête ✅

L'application est **100% dockerisée** avec Docker Compose pour le développement et GitHub Actions pour la CI/CD.

### 🚀 Déploiement Local (Docker Compose)

```bash
# Démarrage complet de l'application
docker-compose up -d

# Services disponibles :
# 🌐 Frontend:    http://localhost:4200
# ⚙️ Backend API: http://localhost:8080
# 🗄️ Database:    localhost:3306

# Arrêt de l'application
docker-compose down
```

### 🏭 Déploiement Production (Docker Hub)

```bash
# Build des images
docker build -t pmt-backend ./backend
docker build -t pmt-frontend ./frontend

# Push vers Docker Hub
docker tag pmt-backend your-username/pmt-backend:latest
docker tag pmt-frontend your-username/pmt-frontend:latest
docker push your-username/pmt-backend:latest
docker push your-username/pmt-frontend:latest
```

### 🔄 CI/CD Automatique

La pipeline GitHub Actions :
- ✅ **Tests automatiques** : Frontend + Backend
- ✅ **Build Docker** : Images optimisées
- ✅ **Push Docker Hub** : Publication automatique
- ✅ **Security Scan** : Analyse de vulnérabilités
- ✅ **Coverage Reports** : Rapports de couverture

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Backend     │    │   Database      │
│   Angular 19    │ -> │  Spring Boot    │ -> │   MySQL 8.0     │
│   TypeScript    │    │    Java 17      │    │     JPA         │
│   Signals       │    │      JWT        │    │   Flyway        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Fonctionnalités

- **🔐 Authentification** : JWT avec rôles (Admin, Member, Observer)
- **📊 Gestion des Projets** : CRUD avec membres et permissions
- **✅ Gestion des Tâches** : Assignation, historique, priorités
- **👥 Gestion des Utilisateurs** : Rôles et permissions différenciées
- **📱 Interface Moderne** : Angular 19 avec Signals et design responsive
- **🌐 API REST** : Spring Boot avec sécurité JWT
- **🗄️ Base de Données** : MySQL avec relations optimisées

## 📚 Documentation

### 📋 [Documentation Globale](docs/index.md)
- **Vue d'ensemble** : Architecture complète et contexte
- **🗄️ [Modèle de Données](docs/data-model.md)** : Source de vérité des entités
- **🌐 [Contrat API](docs/api-contract.md)** : Interface Frontend ↔ Backend
- **🚀 [Déploiement Railway](docs/deployment.md)** : Guide Railway
- **📝 [Étude de Cas](docs/Enonce_Etude_de_cas_PMT.md)** : Contexte académique

### 🎨 [Documentation Frontend](frontend/docs/index.md)
- **Architecture Angular** : Composants, Signals, Services
- **Développement** : Configuration et bonnes pratiques
- **API Mock** : Backend simulé pour développement

### ⚙️ [Documentation Backend](backend/docs/index.md)
- **Architecture Spring Boot** : Couches, sécurité, JPA
- **API REST** : Endpoints testés et validés
- **Tests** : Stratégie complète avec Postman

## 🛠️ Technologies

| Composant | Technologies |
|-----------|--------------|
| **Frontend** | Angular 19, TypeScript, SCSS, Angular Signals |
| **Backend** | Spring Boot 3.2.3, Java 17, Spring Security, JWT |
| **Base de données** | MySQL 8.0, JPA/Hibernate, Flyway |
| **Tests** | Jest (Frontend), JUnit 5 (Backend), Postman |
| **Build** | Angular CLI, Maven |
| **Containerisation** | Docker, Docker Compose |

## 🧪 Tests et Validation

### Tests Automatisés
- **Frontend** : Tests unitaires avec Jest
- **Backend** : Tests unitaires avec JUnit + Mockito
- **API** : Collection Postman complète avec assertions
- **Intégration** : Tests end-to-end Frontend ↔ Backend

### Validation Complète
- ✅ **Cohérence** : 100% entre Frontend et Backend
- ✅ **Relations** : TaskEntity.assigneeId → UserEntity validées
- ✅ **API** : Tous les endpoints testés et fonctionnels
- ✅ **Sécurité** : JWT et permissions opérationnelles

## 🎓 Contexte Académique

### Étude de Cas RNCP
- **Titre** : Expert en Ingénierie du Logiciel (Niveau 7)
- **Organisme** : GROUPE ESIEA INTECH
- **Bloc** : Intégration, industrialisation et déploiement

### Compétences Évaluées
- **C.10** : Développement et modélisation de domaine métier ✅
- **C.12** : Automatisation des builds et tests ✅
- **C.13** : Industrialisation et déploiement ✅

### Livrables
- ✅ **Repository GitHub** : Code source complet
- ✅ **Application Frontend** : Angular 19 fonctionnelle
- ✅ **API Backend** : Spring Boot opérationnelle
- ✅ **Tests automatisés** : Couverture >60%
- ✅ **Dockerisation** : Frontend + Backend + Base de données
- ✅ **Documentation** : Complète et organisée
- ✅ **CI/CD** : Pipeline GitHub Actions (préparé)

## 🔧 Scripts Utiles

```bash
# Démarrage/Arrêt complet
./start-all.sh          # Démarrage complet
./stop-all.sh           # Arrêt propre

# Frontend uniquement
cd frontend
npm start               # Développement
npm run build           # Production
npm test                # Tests

# Backend uniquement  
cd backend
./start-dev.sh          # Avec MySQL
./mvnw spring-boot:run  # Application seule
./mvnw test             # Tests
```

## 👤 Comptes de Test

| Email | Password | Rôle | Projets |
|-------|----------|------|---------|
| admin@example.com | admin123 | Admin | Tous (Admin) |
| alice@example.com | alice123 | Member | E-commerce, Backend API |
| bob@example.com | bob123 | Member | E-commerce, Mobile App |
| charlie@example.com | charlie123 | Member | Mobile App, Backend API |
| diana@example.com | diana123 | Observer | E-commerce, Backend API |

## 📊 État du Projet

### ✅ Fonctionnalités Complètes
- **Interface utilisateur** : Angular 19 avec design moderne
- **API REST** : Spring Boot avec tous les endpoints
- **Authentification** : JWT avec rôles et permissions
- **Base de données** : MySQL avec données de test
- **Tests** : Unitaires + API + Validation complète
- **Documentation** : Organisée et complète
- **Déploiement** : Railway + configuration automatique

### 🎯 Prêt pour
- **Démonstration** : Application complètement fonctionnelle
- **Développement** : Environment configuré
- **Production** : Railway déploiement automatique
- **Évaluation** : Tous les livrables présents

## 📞 Support

- **📚 Documentation** : Consultez [`docs/index.md`](docs/index.md)
- **🐛 Issues** : GitHub Issues avec labels appropriés
- **🧪 Tests API** : Collection Postman fournie
- **💬 Questions** : Voir la documentation spécialisée

---

**🎉 Projet complet et opérationnel - Prêt pour évaluation RNCP**
