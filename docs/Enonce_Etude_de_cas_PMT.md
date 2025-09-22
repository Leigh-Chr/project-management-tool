# Énoncé  
## Étude de cas Project Management Tool  

**TITRE RNCP – Niveau 7 – GROUPE ESIEA INTECH**  
**Bloc de compétences : Intégration, industrialisation et déploiement de logiciel**  
**Expert en Ingénierie du Logiciel**  

---

## Scénario  

Vous êtes un développeur full stack au sein de Code Solutions, une entreprise qui développe des solutions logicielles.  

John Doe, le CEO, vous affecte au projet **PMT** (« Project Management Tool »).  

- Nicolas, le Product Owner, vous transmet la liste des fonctionnalités à implémenter.  
- Mariana, la Tech Lead, vous indique les guidelines techniques à respecter.  

---

## Brief  

**PMT** est une plateforme de gestion de projet collaboratif destinée aux équipes de développement logiciel.  

L'objectif est de créer une application qui permettra aux équipes de planifier, suivre et collaborer sur des projets de manière efficace.  

- La liste des *users stories* est fournie en annexe par Nicolas.  
- La liste des *guidelines techniques* est également fournie en annexe par Mariana.  

Le design de l’application est laissé à votre appréciation.  

---

## Instructions  

### Conception  
- Identifiez les entités clés (utilisateurs, projets, tâches, etc.).  
- Concevez une architecture robuste et évolutive avec **Angular** pour le frontend et **Spring** pour le backend.  

**Livrables :**  
- Schéma de la base de données  
- Script SQL de génération (structure + données de test)  

### Développement  
- Développez une interface utilisateur intuitive avec Angular.  
- Implémentez les fonctionnalités côté serveur avec Java + Spring.  

⚠️ La sécurisation du backend n’est pas requise (Spring Security non obligatoire).  

**Livrable :**  
- Un repository (GitHub, GitLab, etc.) à jour  

### Tests  
- Écrivez des tests automatisés (frontend + backend).  
- Couverture minimale attendue : **60%** (instructions + branches).  

**Livrables :**  
- Rapport de couverture du code frontend  
- Rapport de couverture du code backend  

### Industrialisation  
- Dockerisez le frontend et le backend.  
- Documentez le processus de déploiement dans un `readme.md`.  
- Mettez en place une CI/CD (GitHub Actions, GitLab-CI, ou Jenkins).  
- Les images Docker doivent être publiées sur Docker Hub.  

**Livrables :**  
- Fichier de configuration de la pipeline CI/CD  
- `Dockerfile` du backend  
- `Dockerfile` du frontend  
- `readme.md` avec la procédure de déploiement  

---

## Compétences évaluées  

- **C.10** : Développer les fonctionnalités en modélisant un domaine métier et en intégrant des composants externes.  
- **C.12** : Automatiser la construction avec des chaînes de build et des tests (unitaires, fonctionnels, intégration).  
- **C.13** : Industrialiser le développement à l’aide d’outils d’automatisation et documenter le déploiement.  

---

## Annexes  

### Liste des *user stories*  

- En tant que **visiteur**, je veux pouvoir m'inscrire (nom d’utilisateur, e-mail, mot de passe).  
- En tant qu’**inscrit**, je veux pouvoir me connecter avec e-mail + mot de passe.  
- En tant qu’**utilisateur**, je veux créer un projet (nom, description, date de début).  
- En tant qu’**administrateur**, je veux inviter d’autres membres via leur e-mail.  
- En tant qu’**administrateur**, je veux attribuer des rôles (admin, membre, observateur).  
- En tant qu’**admin ou membre**, je veux créer des tâches (nom, description, échéance, priorité).  
- En tant qu’**admin ou membre**, je veux assigner des tâches à un membre.  
- En tant qu’**admin ou membre**, je veux mettre à jour une tâche.  
- En tant qu’**admin/membre/observateur**, je veux visualiser une tâche.  
- En tant qu’**admin/membre/observateur**, je veux visualiser les tâches par statut sur un tableau de bord.  
- En tant qu’**admin/membre/observateur**, je veux recevoir des notifications par e-mail lorsqu’une tâche est assignée.  
- En tant qu’**admin/membre/observateur**, je veux suivre l’historique des modifications des tâches.  

#### Tableau récapitulatif des droits  

| Action                                | Admin | Membre | Observateur |
|---------------------------------------|:-----:|:------:|:-----------:|
| Ajouter un membre / attribuer un rôle |   X   |        |             |
| Créer une tâche                        |   X   |   X    |             |
| Assigner une tâche                     |   X   |   X    |             |
| Mettre à jour une tâche                |   X   |   X    |             |
| Visualiser une tâche                   |   X   |   X    |      X      |
| Visualiser le tableau de bord          |   X   |   X    |      X      |
| Être notifié                           |   X   |   X    |      X      |
| Voir l’historique                      |   X   |   X    |      X      |

---

### Guidelines techniques  

#### Technologies à utiliser  
- **Angular** : framework frontend  
- **Java + Spring Boot** : backend  
- **PostgreSQL** ou **MySQL** : base de données relationnelle  
- **Git** : gestion de version  
- **IntelliJ IDEA** ou **Eclipse** : IDE  

#### Bonnes pratiques  
- **Tests** :  
  - Unitaires (frontend : Jest / backend : JUnit, Mockito, Spring Boot Test)  
  - Intégration (interactions entre couches)  
- **CI/CD** :  
  - Pipeline de build, test et déploiement  
  - Publication des images Docker (frontend et backend) sur Docker Hub  
- **Documentation** :  
  - Commentaires clairs et concis dans le code  
  - Documentation des API et endpoints (descriptions, exemples, paramètres, réponses)  
