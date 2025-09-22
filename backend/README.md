# Project Management Tool - Backend

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://openjdk.java.net/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)

API REST pour l'application de gestion de projet collaborative, développée avec Spring Boot.

## 🚀 Démarrage Rapide

### Prérequis
- Java 17+
- Maven 3.6+
- Docker & Docker Compose

### Installation et Démarrage

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd project-management-tool/backend
   ```

2. **Démarrage avec script automatique**
   ```bash
   ./start-dev.sh
   ```

3. **Démarrage manuel**
   ```bash
   # Démarrer MySQL
   docker-compose up -d mysql
   
   # Démarrer l'application
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
   ```

L'API sera accessible sur `http://localhost:8080`

## 📊 Services Disponibles

- **API REST** : `http://localhost:8080`
- **PhpMyAdmin** : `http://localhost:8081` (root/root)
- **Base de données** : `localhost:3306` (root/root)

## 📋 Fonctionnalités

- **Authentification JWT** : Login/Register avec tokens sécurisés
- **Gestion des Utilisateurs** : CRUD complet avec rôles
- **Gestion des Projets** : Création, modification, suppression
- **Gestion des Tâches** : Assignation, historique, priorités
- **Gestion des Membres** : Rôles Admin/Member/Observer
- **API REST complète** : Endpoints documentés

## 🏗️ Architecture

```
src/main/java/com/projectmanagementtool/backend/
├── config/          # Configuration Spring Security, JPA
├── controller/      # Contrôleurs REST
├── dto/            # Data Transfer Objects
├── exception/      # Gestion d'erreurs globale
├── mapper/         # Conversion Entity ↔ DTO
├── model/          # Entités JPA
├── repository/     # Repositories Spring Data
├── security/       # JWT, Authentification
└── service/        # Logique métier
```

## 🗄️ Modèle de Données

### Entités Principales
- **User** : Utilisateurs du système
- **Role** : Admin, Member, Observer
- **Status** : To Do, In Progress, Done
- **Project** : Projets avec membres
- **ProjectMember** : Association User ↔ Project ↔ Role
- **Task** : Tâches assignées aux utilisateurs
- **TaskEvent** : Historique des modifications

### Relations Clés
```sql
Task.assignee_id → User.id (CORRIGÉ - cohérent avec frontend)
ProjectMember(project_id, user_id) → UNIQUE
Task → Project, User, Status
TaskEvent → Task
```

## 🔧 Configuration

### Profiles Disponibles
- **dev** : Développement local avec logs détaillés
- **prod** : Production avec optimisations

### Variables d'Environnement

#### Développement (application-dev.properties)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/project_management
spring.datasource.username=root
spring.datasource.password=root
```

#### Production (application-prod.properties)
```properties
DATABASE_URL=jdbc:mysql://host:port/database
DB_USERNAME=username
DB_PASSWORD=password
JWT_SECRET=your-secret-key
```

## 🧪 Tests

### Exécuter les tests
```bash
./mvnw test
```

### Couverture de code
```bash
./mvnw test jacoco:report
```
Rapport disponible dans `target/site/jacoco/index.html`

### Tests disponibles
- **UserServiceTest** : Tests unitaires du service utilisateur
- **AuthControllerTest** : Tests d'intégration de l'authentification
- **BackendApplicationTests** : Test de contexte Spring

## 🐳 Docker

### Docker Compose (Développement)
```bash
docker-compose up -d mysql     # MySQL uniquement
docker-compose up -d           # Tous les services
```

### Services Docker
- **mysql** : Base de données MySQL 8.0
- **phpmyadmin** : Interface web pour MySQL

## 📚 Documentation

### Documentation Globale
- [**📋 Index Global**](../docs/index.md) - Vue d'ensemble complète du projet
- [**🗄️ Modèle de Données**](../docs/data-model.md) - Source de vérité des entités
- [**🌐 Contrat API**](../docs/api-contract.md) - Interface Frontend ↔ Backend
- [**🐳 Déploiement**](../docs/deployment.md) - Guide complet Frontend + Backend

### Documentation Backend
- [**📋 Backend Index**](docs/index.md) - Documentation Spring Boot complète
- [**🏗️ Architecture**](docs/architecture.md) - Structure Spring Boot et patterns
- [**🛠️ Développement**](docs/development.md) - Configuration et bonnes pratiques
- [**🌐 API REST**](docs/api.md) - Endpoints testés et validés
- [**🗄️ Entités JPA**](docs/data-model.md) - Implémentation du modèle
- [**🐳 Déploiement Backend**](docs/deployment.md) - Spring Boot spécifique
- [**🧪 Tests et Qualité**](docs/testing.md) - Stratégie de tests complète

## 📚 API Documentation

### Endpoints Principaux

#### Authentification
- `POST /api/auth/register` : Inscription
- `POST /api/auth/login` : Connexion
- `POST /api/auth/logout` : Déconnexion

#### Projets
- `GET /api/projects` : Liste des projets
- `POST /api/projects` : Créer un projet
- `GET /api/projects/{id}/details` : Détails complets

#### Tâches
- `GET /api/tasks` : Liste des tâches
- `POST /api/tasks` : Créer une tâche
- `PATCH /api/tasks/{id}` : Modifier une tâche

### Authentification
Toutes les requêtes (sauf auth) nécessitent un header :
```
Authorization: Bearer {jwt_token}
```

## 🚦 Migration de Base de Données

### Migrations Flyway
- `V1__init_schema.sql` : Création des tables
- `V2__add_indexes.sql` : Index pour performances
- `V3__insert_initial_data.sql` : Données de test
- `V4__remove_timestamps.sql` : Nettoyage

### Données de Test
- **5 utilisateurs** : admin, alice, bob, charlie, diana
- **3 projets** : E-commerce, Mobile App, Backend API
- **8 tâches** avec assignations correctes
- **Mots de passe** : {username}123 (ex: admin123)

## 🔍 Debugging

### Logs
```bash
# Logs en temps réel
tail -f spring-boot.log

# Logs SQL
spring.jpa.show-sql=true (dev profile)
```

### Base de Données
```bash
# Accès MySQL direct
docker-compose exec mysql mysql -u root -p project_management

# PhpMyAdmin
http://localhost:8081
```

## 🛡️ Sécurité

### Features Implémentées
- **JWT Authentication** : Tokens sécurisés
- **Password Hashing** : BCrypt
- **CORS Configuration** : Frontend autorisé
- **Validation** : Bean Validation sur toutes les entités
- **SQL Injection Protection** : JPA Repositories

### Recommandations Production
- Changer le `JWT_SECRET`
- Utiliser HTTPS
- Configurer les variables d'environnement
- Activer le profil `prod`

## 📈 Performance

### Optimisations
- **Index SQL** : Sur toutes les clés étrangères
- **Lazy Loading** : Relations JPA optimisées
- **Connection Pool** : HikariCP configuré
- **Validation** : Au niveau entité et contrôleur

## 🔄 CI/CD

### GitHub Actions (à venir)
```yaml
- Build & Test
- Code Coverage
- Docker Build
- Deploy to Production
```

## 📞 Support

- **Issues** : GitHub Issues
- **Documentation** : Voir `/docs` du frontend
- **API Contract** : `frontend/docs/api-contract.md`

---

**Status** : ✅ **COHÉRENT avec la documentation frontend**
**Dernière mise à jour** : Septembre 2024
