# Feuille de Travail  
## Étude de cas PMT  

**TITRE RNCP – Niveau 7 – GROUPE ESIEA INTECH**  
**Bloc de compétences : Intégration, industrialisation et déploiement de logiciel**  
**Expert en Ingénierie du Logiciel**  

---

## Informations générales  

**Nom et prénom du stagiaire (à compléter) :** _____________________________  

---

## Compétences et critères d’évaluation  

| Compétences évaluées | Critères d’évaluation |
|-----------------------|-----------------------|
| **Développer les fonctionnalités du logiciel** en modélisant un domaine métier, et en intégrant des composants externes afin d’améliorer la qualité du code et faciliter les développements futurs. | - L’application est fonctionnelle et suit les recommandations techniques.<br>- Le schéma de base de données est complet et sans incohérence relationnelle.<br>- Les frameworks Angular et Spring sont utilisés. |
| **Automatiser la construction de la solution logicielle** en configurant les chaînes de build et l’exécution des tests unitaires, fonctionnels et d’intégration afin de préparer le déploiement continu du logiciel. | - Les tests sont écrits tant pour le frontend que le backend avec une couverture minimum de **60%** (instructions et branches).<br>- Une pipeline est mise en œuvre et son fichier de configuration est disponible. Elle permet d’exécuter les tests. |
| **Industrialiser le développement du logiciel** à l’aide d’outils d’automatisation et le documenter en décrivant le processus de déploiement de manière à faire évoluer les logiciels développés et minimiser les erreurs de manipulation par les tiers. | - Le backend et le frontend sont dockerisés.<br>- La pipeline permet de pusher les images sur **Docker Hub**.<br>- Le fichier `readme.md` fournit la procédure de déploiement de l’application. |

---

## Instructions  

### Étape 1. Conception  

**AIDE**  

- Illustration (indiquer source) : *à compléter*  

**Pistes de travail :**  
- Identifiez les entités en premier.  
- Identifiez les relations en deuxième.  
- Vérifiez l’application des formes normales.  

---

### Étape 2. Développement  

**AIDE**  

**Liens vers des ressources externes :**  
- [Documentation Angular](https://angular.io/docs)  
- [Baeldung – Spring Boot](https://www.baeldung.com/spring-boot)  
- [Angular HTTP Client](https://angular.fr/http/client.html)  

Illustration (indiquer source) : *N/A, voir ressources externes*  

**Pistes de travail :**  
- Adoptez une approche par **fonctionnalité** : développez la première fonctionnalité de bout en bout (frontend + backend), puis continuez ainsi.  
- Pour interagir avec une base relationnelle, utilisez **Spring Data**.  

---

### Question 3. Tests  

**AIDE**  

**Liens vers des ressources externes :**  
- [Testing web applications avec Spring](https://spring.io/guides/gs/testing-web)  
- [Angular Unit Testing avec Jest (2023)](https://medium.com/@megha.d.parmar2018/angular-unit-testing-with-jest-2023-2676faa2e564)  

Illustration (indiquer source) : *N/A, voir ressources externes*  

**Pistes de travail :**  
- Pour obtenir le coverage des tests frontend, utilisez le flag `--coverage`.  
- Pour obtenir le coverage des tests backend, utilisez le plugin **Jacoco**.  

---

### Question 4. Industrialisation  

**AIDE**  

**Liens vers des ressources externes :**  
- [GitHub Actions – Understanding](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions)  
- [GitHub Actions – Java + Maven](https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-java-with-maven)  
- [GitHub Actions – Node.js](https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs)  

**Illustrations (indiquer source) :**  
- Back : [Java avec Maven](https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-java-with-maven)  
- Front : [Node.js](https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs)  

**Pistes de travail :**  
- Traitez d’abord le **frontend** ou le **backend**, puis l’autre.  
- Utilisez les standards existants (nombreux exemples disponibles dans la documentation).  
