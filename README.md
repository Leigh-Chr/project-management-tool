# Project Management Tool

Application web de gestion de projet développée avec Angular 19.

## Fonctionnalités

- Authentification sécurisée (login/register)
- Gestion complète des projets
  - Création et suppression de projets
  - Détails des projets (dates, statut, description)
  - Gestion des membres et des rôles
- Gestion des tâches
  - Création et suivi des tâches
  - Association aux projets
- Interface utilisateur moderne et responsive

## Prérequis

- Node.js 22 (version LTS)
- npm
- Docker

## Installation

1. Cloner le repository :
```bash
git clone https://github.com/Leigh-Chr/project-management-tool
cd project-management-tool
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

4. Lancer l'application :
```bash
npm start
```

L'application sera accessible à l'adresse : `http://localhost:4200`

## Build & Déploiement

Build pour la production :
```bash
npm run build
```

Déploiement avec Docker :
```bash
docker build -t project-management-tool .
docker-compose up -d
```

L'application sera accessible à l'adresse : `http://localhost:80`

## Tests

```bash
npm run test
```

## Structure du Projet

```
project-management-tool/
├── src/                    # Code source
│   ├── app/               # Application
│   │   ├── core/         # Services principaux
│   │   ├── shared/       # Contenu réutilisable
│   │   ├── pages/        # Pages
│   │   ├── interceptors/ # Intercepteurs HTTP
│   │   └── styles/       # Styles spécifiques
│   ├── environments/      # Configuration
│   └── assets/           # Ressources
├── public/                # Fichiers statiques
└── docs/                  # Documentation
```

## Sécurité

- Authentification sécurisée avec tokens JWT
- Protection des routes avec guards
- Validation des entrées
- Variables d'environnement
