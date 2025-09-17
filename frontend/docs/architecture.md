# Architecture du Projet PMT

## Vue d'ensemble

Le projet PMT suit une architecture modulaire Angular avec une séparation claire des responsabilités et une approche moderne utilisant les Angular Signals.

## Structure du Projet

```
src/app/
├── pages/                    # Pages principales de l'application
│   ├── home/                # Page d'accueil (non authentifiée)
│   ├── login/               # Page de connexion
│   ├── register/            # Page d'inscription
│   ├── projects/            # Gestion des projets
│   │   ├── projects.component.ts
│   │   └── project-details.component.ts
│   └── tasks/               # Gestion des tâches
│       └── task-details.component.ts
├── shared/                  # Composants et services partagés
│   ├── components/          # Composants réutilisables
│   │   ├── popups/         # Modales et popups
│   │   ├── toast/          # Système de notifications
│   │   └── ui/             # Composants UI de base
│   ├── guards/             # Guards de navigation
│   ├── interceptors/       # Intercepteurs HTTP
│   ├── layouts/            # Layouts de pages
│   ├── models/             # Modèles TypeScript
│   └── services/           # Services métier
│       ├── data/           # Services de données
│       └── mock/           # Backend mock
└── styles/                 # Styles globaux
```

## Architecture des Composants

### Pattern de Composant

Chaque composant suit une structure cohérente :

```typescript
@Component({
  selector: 'pmt-component',
  imports: [...],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`,
})
export class ComponentName {
  // Signals pour l'état local
  readonly data = signal<Type>(initialValue);
  
  // Computed values dérivées
  readonly computedValue = computed(() => ...);
  
  // Services injectés
  private readonly service = inject(ServiceName);
  
  constructor() {
    // Effects pour les réactions aux changements
    effect(() => {
      // Logique réactive
    });
  }
}
```

### Gestion d'État avec Signals

Le projet utilise Angular Signals pour une gestion d'état réactive :

- **Signals** : État local des composants
- **Computed** : Valeurs calculées automatiquement
- **Effects** : Réactions aux changements d'état
- **toSignal()** : Conversion d'Observables en signals

## Architecture des Services

### Services de Données

Les services de données encapsulent la logique métier :

```typescript
@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly apiService = inject(ApiService);
  
  // Signals pour l'état global
  readonly data = signal<Type[]>([]);
  
  // Méthodes CRUD avec gestion d'état
  getData(): Observable<Type[]> {
    // Logique de récupération
  }
}
```

### Backend Mock

Le backend mock simule une API complète :

- **Controllers** : Logique métier simulée
- **Database Service** : Base de données en mémoire
- **Authentification** : JWT avec hash SHA-256

## Flux de Données

### Authentification

1. **Login/Register** → AuthService
2. **Token JWT** → Cookie + Signal
3. **Intercepteur** → Ajout automatique du token
4. **Guards** → Protection des routes

### Gestion des Projets

1. **Liste des projets** → ProjectService.getProjects()
2. **Détails** → ProjectService.getProjectDetails()
3. **CRUD** → Signals réactifs pour l'UI
4. **Permissions** → Vérification des rôles

### Gestion des Tâches

1. **Création** → TaskService.addTask()
2. **Assignation** → Mise à jour des assignees
3. **Historique** → TaskEvent tracking
4. **Notifications** → ToastService

## Sécurité

### Authentification

- **JWT Tokens** : Authentification stateless
- **Expiration** : Gestion automatique de l'expiration
- **Cookies** : Stockage sécurisé côté client
- **Intercepteur** : Ajout automatique des headers

### Autorisation

- **Guards** : Protection des routes
- **Rôles** : Admin, Member, Observer
- **Permissions** : Vérification côté service
- **UI Conditionnelle** : Affichage selon les droits

## Performance

### Optimisations

- **OnPush Change Detection** : Détection optimisée
- **Signals** : Réactivité fine
- **Lazy Loading** : Chargement paresseux
- **Tree Shaking** : Élimination du code mort

### Bundle

- **Angular 19** : Optimisations natives
- **TypeScript** : Compilation optimisée
- **Tailwind CSS** : Purge automatique
- **Gzip** : Compression des assets

## Évolutivité

### Modularité

- **Composants** : Réutilisables et testables
- **Services** : Injection de dépendances
- **Modules** : Organisation logique
- **Lazy Loading** : Chargement à la demande

### Extensibilité

- **Interfaces** : Contrats clairs
- **Types** : TypeScript strict
- **Patterns** : Architecture cohérente
- **Documentation** : Code auto-documenté

## Tests

### Stratégie

- **Unit Tests** : Composants et services
- **Integration Tests** : Flux complets
- **E2E Tests** : Scénarios utilisateur
- **Coverage** : Objectif 60%+

### Outils

- **Jest** : Framework de test
- **Angular Testing Utilities** : Helpers Angular
- **Mock Services** : Simulation des dépendances
- **Test Bed** : Configuration des tests

## Monitoring

### Métriques

- **Performance** : Core Web Vitals
- **Bundle Size** : Taille des assets
- **Coverage** : Couverture de tests
- **Linting** : Qualité du code

### Outils

- **Angular DevTools** : Debugging
- **Lighthouse** : Performance
- **ESLint** : Qualité du code
- **Prettier** : Formatage

---

**Références :**
- [Guide de développement](development.md)
- [API Documentation](api.md)
- [Déploiement](deployment.md)
