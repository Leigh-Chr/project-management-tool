# Documentation Project Management Tool (PMT)

Bienvenue dans la documentation complète du **Project Management Tool**, une plateforme de gestion de projet collaborative développée avec Angular et Spring Boot.

## 🎯 Vue d'ensemble du Projet

**PMT** est une application full-stack moderne destinée aux équipes de développement logiciel, développée dans le cadre d'une étude de cas RNCP niveau 7 "Expert en Ingénierie du Logiciel".

### Technologies
- **Frontend** : Angular 19, TypeScript, SCSS, Angular Signals
- **Backend** : Spring Boot 3.2.3, Java 17, Spring Security, JWT
- **Base de données** : MySQL 8.0, JPA/Hibernate, Flyway
- **Containerisation** : Docker, Docker Compose
- **Tests** : Jest (Frontend), JUnit 5 (Backend), Postman

## 📚 Documentation Globale

### [📝 Étude de Cas](Enonce_Etude_de_cas_PMT.md)
- Contexte et objectifs du projet
- User stories et exigences fonctionnelles
- Guidelines techniques et contraintes
- Critères d'évaluation

### [📋 Feuille de Travail](Feuille_de_travail_PMT.md)
- Planning et livrables
- Méthodologie de développement
- Checklist de validation

### [🗄️ Modèle de Données](data-model.md)
- **Source de vérité** pour les entités et relations
- Cohérence Frontend ↔ Backend validée
- Relations TaskEntity.assigneeId → UserEntity (corrigée)
- Scripts SQL et données de test

### [🌐 Contrat API](api-contract.md)
- Interface partagée Frontend ↔ Backend
- Spécifications des endpoints REST
- Structures de requêtes et réponses
- Système de permissions et authentification

### [🐳 Déploiement Complet](deployment.md)
- Déploiement local et Docker
- Configuration des environnements
- CI/CD et déploiement en production
- Monitoring et maintenance

## 🎨 Documentation Frontend

### [📋 Frontend Index](../frontend/docs/index.md)
Documentation complète du frontend Angular

#### Spécifique Frontend
- [🏗️ Architecture Angular](../frontend/docs/architecture.md) - Composants, Signals, Services
- [🛠️ Développement Angular](../frontend/docs/development.md) - Configuration, conventions
- [🔧 API Mock](../frontend/docs/api.md) - Backend mock intégré
- [✅ Vérification](../frontend/docs/verification.md) - Tests et validation

## ⚙️ Documentation Backend

### [📋 Backend Index](../backend/docs/index.md)
Documentation complète du backend Spring Boot

#### Spécifique Backend
- [🏗️ Architecture Spring Boot](../backend/docs/architecture.md) - Couches, sécurité, JPA
- [🛠️ Développement Spring](../backend/docs/development.md) - Configuration, conventions
- [🌐 API REST](../backend/docs/api.md) - Endpoints testés et validés
- [🗄️ Entités JPA](../backend/docs/data-model.md) - Implémentation du modèle
- [🐳 Déploiement Backend](../backend/docs/deployment.md) - Spring Boot spécifique
- [🧪 Tests Backend](../backend/docs/testing.md) - Tests unitaires et API

## 🚀 Démarrage Rapide

### Développement Local

```bash
# 1. Cloner le projet
git clone <repository-url>
cd project-management-tool

# 2. Démarrer l'infrastructure complète
./start-all.sh

# Ou manuellement :
# Backend
cd backend && ./start-dev.sh

# Frontend (nouveau terminal)
cd frontend && npm install && npm start
```

### Services Disponibles

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:4200 | Application Angular |
| **Backend API** | http://localhost:8080 | API REST Spring Boot |
| **PhpMyAdmin** | http://localhost:8081 | Interface MySQL |
| **MySQL** | localhost:3306 | Base de données |

### Comptes de Test

| Username | Email | Password | Rôle |
|----------|-------|----------|------|
| admin | admin@example.com | admin123 | Admin (tous projets) |
| alice | alice@example.com | alice123 | Member (projets 1,3) |
| bob | bob@example.com | bob123 | Member (projets 1,2) |
| charlie | charlie@example.com | charlie123 | Member (projets 2,3) |
| diana | diana@example.com | diana123 | Observer (projets 1,3) |

## 🔧 Outils de Développement

### Collection Postman
- **Fichier** : [`backend/PMT-Backend-Test-Collection.postman_collection.json`](../backend/PMT-Backend-Test-Collection.postman_collection.json)
- **Usage** : Tests automatisés de l'API backend
- **Variables** : baseUrl, authToken (auto-configurées)

### Scripts Utiles
- **`start-all.sh`** : Démarrage complet (à créer)
- **`stop-all.sh`** : Arrêt propre (à créer)
- **`backend/start-dev.sh`** : Backend uniquement
- **`health-check.sh`** : Vérification des services (à créer)

## 🏗️ Architecture Globale

```
┌─────────────────────────────────────────────────────────────┐
│                    Project Management Tool                   │
├─────────────────────┬─────────────────────┬─────────────────┤
│      Frontend       │       Backend       │     Database    │
│     (Angular)       │   (Spring Boot)     │     (MySQL)     │
├─────────────────────┼─────────────────────┼─────────────────┤
│ • Components        │ • REST Controllers  │ • Tables        │
│ • Services          │ • Business Services │ • Relations     │
│ • Angular Signals   │ • JPA Entities      │ • Indexes       │
│ • SCSS Styling      │ • JWT Security      │ • Migrations    │
│ • Guards & Routes   │ • Validation        │ • Data          │
└─────────────────────┴─────────────────────┴─────────────────┘
```

## 📊 État du Projet

### ✅ Fonctionnalités Complètes
- **Authentification** : JWT avec rôles (Admin, Member, Observer)
- **Gestion des Projets** : CRUD avec membres et permissions
- **Gestion des Tâches** : Assignation, historique, priorités
- **Interface Moderne** : Angular 19 avec Signals
- **API REST** : Spring Boot avec sécurité
- **Base de Données** : MySQL avec relations optimisées

### 🔄 Validation Complète
- **Frontend** : Interface fonctionnelle avec mock backend
- **Backend** : API REST complète et testée
- **Cohérence** : 100% entre frontend et backend
- **Relations** : TaskEntity.assigneeId → UserEntity validées
- **Tests** : Collection Postman avec tous les endpoints
- **Documentation** : Complète et organisée

## 🎓 Contexte Académique

Ce projet fait partie d'une **étude de cas RNCP niveau 7** :

- **Compétences évaluées** :
  - C.10 : Développement et modélisation de domaine métier
  - C.12 : Automatisation des builds et tests
  - C.13 : Industrialisation et déploiement

- **Livrables** :
  - ✅ Repository GitHub complet
  - ✅ Frontend Angular fonctionnel
  - ✅ Backend Spring Boot opérationnel
  - ✅ Tests automatisés (>60% couverture)
  - ✅ Dockerisation complète
  - ✅ Documentation technique

## 📞 Support

### Questions Générales
- **Issues** : GitHub Issues avec labels appropriés
- **Documentation** : Consultez cette documentation

### Questions Spécifiques
- **Frontend** : [Documentation Angular](../frontend/docs/index.md)
- **Backend** : [Documentation Spring Boot](../backend/docs/index.md)
- **API** : [Collection Postman](../backend/PMT-Backend-Test-Collection.postman_collection.json)

### Communauté
- **Angular** : [Forum officiel](https://angular.io/community)
- **Spring Boot** : [Documentation officielle](https://spring.io/projects/spring-boot)

---

**Dernière mise à jour** : Septembre 2024  
**Status** : ✅ **Projet complet et opérationnel**
