# Documentation Backend PMT

Bienvenue dans la documentation du **backend Spring Boot** du Project Management Tool (PMT).

## 📚 Documentation Disponible

### [Architecture Backend](architecture.md)
- Vue d'ensemble de l'architecture Spring Boot
- Structure des couches et composants
- Gestion de la sécurité avec JWT
- Patterns et bonnes pratiques
- Performance et évolutivité

### [Guide de Développement](development.md)
- Configuration de l'environnement de développement
- Conventions de code et structure des packages
- Développement avec Spring Boot et JPA
- Tests unitaires et d'intégration
- Debugging et outils de développement

### [API REST Documentation](api.md)
- Documentation complète des endpoints REST
- Authentification JWT et autorisation
- Modèles de requêtes et réponses
- Codes d'erreur et gestion d'exceptions
- Collection Postman pour les tests

### [Modèle de Données](data-model.md)
- Entités JPA et relations
- Schéma de base de données MySQL
- Migrations Flyway et données de test
- Contraintes d'intégrité et index
- Scripts SQL de création

### [Guide de Déploiement](deployment.md)
- Déploiement local avec Docker
- Configuration des environnements
- Variables d'environnement et profils
- Déploiement en production
- Monitoring et logs

### [Tests et Qualité](testing.md)
- Stratégie de tests (unitaires, intégration)
- Configuration JUnit et Mockito
- Couverture de code avec JaCoCo
- Qualité de code avec PMD
- Tests d'API avec Postman

## 🚀 Démarrage Rapide

Pour commencer rapidement avec le backend :

1. **Installation** : Consultez le [README](../README.md) pour l'installation
2. **Développement** : Suivez le [Guide de Développement](development.md)
3. **Architecture** : Comprenez l'[Architecture Backend](architecture.md)
4. **API** : Explorez la [Documentation API](api.md)
5. **Base de Données** : Consultez le [Modèle de Données](data-model.md)
6. **Déploiement** : Consultez le [Guide de Déploiement](deployment.md)

## 🛠️ Technologies

- **Framework** : Spring Boot 3.2.3, Spring Security
- **Language** : Java 17
- **Base de données** : MySQL 8.0, JPA/Hibernate
- **Migrations** : Flyway
- **Authentification** : JWT (jsonwebtoken)
- **Tests** : JUnit 5, Mockito, Spring Boot Test
- **Build** : Maven 3.6+
- **Containerisation** : Docker

## 🔗 Intégration Frontend

### Cohérence avec le Frontend
Cette documentation backend est **parfaitement cohérente** avec la documentation globale :

- **Relations** : TaskEntity.assigneeId → UserEntity.id (corrigé)
- **API Contract** : Endpoints et structures de réponse alignés
- **Modèle de données** : 100% cohérent avec le modèle global
- **Authentification** : JWT compatible avec Angular

### Références Globales
- [📋 Documentation Globale](../../docs/index.md)
- [🗄️ Modèle de Données Global](../../docs/data-model.md)
- [🌐 Contrat API Global](../../docs/api-contract.md)
- [🎨 Frontend Documentation](../../frontend/docs/index.md)

## 📊 État du Projet

### ✅ Fonctionnalités Implémentées
- **API REST complète** : Tous les endpoints CRUD
- **Authentification JWT** : Login/Register/Logout
- **Gestion des utilisateurs** : CRUD avec rôles
- **Gestion des projets** : CRUD avec membres
- **Gestion des tâches** : CRUD avec assignation et historique
- **Base de données** : Schéma complet avec données de test
- **Sécurité** : Spring Security configuré
- **Tests** : Tests unitaires et collection Postman

### 🔄 Tests Validés
- **Compilation** : 69 classes, 0 erreur
- **Tests unitaires** : 7/7 passés (UserServiceTest)
- **Endpoints** : Tous testés et fonctionnels
- **Base de données** : Relations validées
- **Authentification** : JWT opérationnel

## 📞 Support

Pour toute question ou problème :

- **Issues** : Utilisez le système d'issues GitHub
- **Documentation** : Consultez cette documentation
- **API Testing** : Utilisez la collection Postman fournie
- **Logs** : Consultez `spring-boot.log` pour le debugging

---

**Dernière mise à jour** : Septembre 2024
**Status** : ✅ **Opérationnel et cohérent avec frontend**
