# Documentation Frontend PMT

Bienvenue dans la documentation du **frontend Angular** du Project Management Tool (PMT).

## 📚 Documentation Frontend

### [Architecture Frontend](architecture.md)
- Vue d'ensemble de l'architecture Angular
- Structure des composants et services
- Gestion d'état avec Angular Signals
- Flux de données et réactivité
- Performance et optimisations

### [Guide de Développement Frontend](development.md)
- Configuration de l'environnement Angular
- Conventions de code et bonnes pratiques
- Développement avec Angular Signals
- Tests unitaires et d'intégration
- Debugging et outils de développement

### [API Mock Frontend](api.md)
- Documentation du backend mock intégré
- Services de données simulées
- Authentification mock avec JWT
- Intercepteurs et gestion d'état
- Migration vers le vrai backend

### [Vérification Frontend](verification.md)
- Tests de validation du frontend
- Contrôles qualité et conformité
- Métriques de performance
- Validation des fonctionnalités

## 🔗 Documentation Globale

Pour la documentation transverse du projet :

### [📋 Index Global](../../docs/index.md)
Vue d'ensemble complète du projet PMT

### [🗄️ Modèle de Données](../../docs/data-model.md)
Source de vérité pour les entités et relations (Frontend ↔ Backend)

### [🌐 Contrat API](../../docs/api-contract.md)
Interface partagée entre Frontend et Backend

### [🐳 Déploiement Global](../../docs/deployment.md)
Guide de déploiement complet (Frontend + Backend + Base de données)

### [📝 Étude de Cas](../../docs/Enonce_Etude_de_cas_PMT.md)
Contexte et exigences du projet

## 🔗 Documentation Backend

Pour la documentation spécifique au backend :

### [⚙️ Backend Index](../../backend/docs/index.md)
Documentation complète du backend Spring Boot

### [🏗️ Backend Architecture](../../backend/docs/architecture.md)
Architecture Spring Boot et patterns

### [🌐 Backend API](../../backend/docs/api.md)
Endpoints REST testés et validés

### [🧪 Backend Testing](../../backend/docs/testing.md)
Tests et validation du backend

## 🚀 Démarrage Rapide Frontend

### Prérequis
- Node.js 20+
- npm 10+

### Installation
```bash
cd frontend
npm install
npm start
```

L'application sera accessible sur `http://localhost:4200`

### Avec le Backend
```bash
# Terminal 1 : Backend
cd backend && ./start-dev.sh

# Terminal 2 : Frontend  
cd frontend && npm start
```

## 🛠️ Technologies Frontend

- **Framework** : Angular 19, TypeScript
- **État** : Angular Signals
- **Styling** : SCSS personnalisé
- **Tests** : Jest, Angular Testing Utilities
- **Build** : Angular CLI, Webpack
- **Containerisation** : Docker, Nginx

## 📊 Métriques Frontend

- **Bundle Size** : Optimisé avec tree-shaking
- **Performance** : Core Web Vitals
- **Tests** : Couverture avec Jest
- **Linting** : ESLint avec règles strictes

## 📞 Support Frontend

Pour les questions spécifiques au frontend :

- **Issues** : GitHub Issues avec label "frontend"
- **Angular** : [Documentation officielle](https://angular.io/)
- **Signals** : [Guide Angular Signals](https://angular.io/guide/signals)
- **Testing** : [Angular Testing Guide](https://angular.io/guide/testing)

---

**Dernière mise à jour** : Septembre 2024  
**Cohérence** : ✅ 100% avec backend et documentation globale