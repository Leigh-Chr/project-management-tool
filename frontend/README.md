# Project Management Tool (PMT)

[![Angular](https://img.shields.io/badge/Angular-19.2.5-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.2-blue.svg)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

Une plateforme de gestion de projet collaborative développée avec Angular 19, destinée aux équipes de développement logiciel.

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 20+
- npm 10+

### Installation
```bash
git clone <repository-url>
cd project-management-tool/frontend
npm install
npm start
```

L'application sera accessible sur `http://localhost:4200`

### Avec Docker
```bash
docker build -t pmt-frontend .
docker run -p 80:80 pmt-frontend
```

## 📋 Fonctionnalités

- **Authentification** : Inscription/Connexion avec JWT
- **Gestion des Projets** : Création, visualisation, gestion des membres
- **Gestion des Tâches** : Création, assignation, suivi avec historique
- **Rôles** : Admin, Member, Observer avec permissions différenciées
- **Interface Moderne** : Design responsive avec Tailwind CSS

## 🛠️ Technologies

- **Frontend** : Angular 19, TypeScript, Tailwind CSS
- **Backend** : Mock intégré (en attendant Spring Boot)
- **Containerisation** : Docker, Nginx
- **État** : Angular Signals

## 📚 Documentation

Pour une documentation complète, consultez le dossier [`docs/`](docs/) :
- [Architecture détaillée](docs/architecture.md)
- [Guide de développement](docs/development.md)
- [API Documentation](docs/api.md)
- [Déploiement](docs/deployment.md)

## 🔧 Scripts

```bash
npm start          # Développement
npm run build      # Production
npm test           # Tests
npm run lint       # Linting
```

## 📄 Licence

MIT License - voir [LICENSE](LICENSE) pour plus de détails.
