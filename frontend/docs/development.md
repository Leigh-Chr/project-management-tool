# Guide de Développement

## Configuration de l'Environnement

### Prérequis

- **Node.js** : Version 20 ou supérieure
- **npm** : Version 10 ou supérieure
- **Angular CLI** : Installé globalement
- **Git** : Pour le contrôle de version

### Installation

```bash
# Cloner le repository
git clone <repository-url>
cd project-management-tool/frontend

# Installer les dépendances
npm install

# Vérifier l'installation
ng version
```

## Structure du Code

### Conventions de Nommage

- **Fichiers** : kebab-case (`user-service.ts`)
- **Composants** : PascalCase (`UserComponent`)
- **Services** : PascalCase + Service (`UserService`)
- **Interfaces** : PascalCase (`User`, `ProjectDetails`)
- **Variables** : camelCase (`userName`, `projectList`)

### Organisation des Fichiers

```
src/app/
├── pages/                    # Pages principales
│   └── feature/
│       ├── feature.component.ts
│       ├── feature.component.spec.ts
│       └── feature-details.component.ts
├── shared/
│   ├── components/          # Composants réutilisables
│   │   └── ui/
│   │       ├── button.component.ts
│   │       └── button.component.spec.ts
│   ├── services/           # Services métier
│   │   └── data/
│   │       ├── user.service.ts
│   │       └── user.service.spec.ts
│   └── models/             # Modèles TypeScript
│       ├── user.models.ts
│       └── project.models.ts
```

## Développement avec Angular Signals

### Création d'un Composant

```typescript
import { Component, signal, computed, effect, inject } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'pmt-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <h2>{{ title() }}</h2>
      <p>Count: {{ count() }}</p>
      <button (click)="increment()">Increment</button>
    </div>
  `
})
export class ExampleComponent {
  // Signals pour l'état
  readonly count = signal(0);
  readonly title = signal('Example Component');
  
  // Computed values
  readonly doubleCount = computed(() => this.count() * 2);
  
  // Services injectés
  private readonly service = inject(SomeService);
  
  constructor() {
    // Effects pour les réactions
    effect(() => {
      console.log('Count changed:', this.count());
    });
  }
  
  increment(): void {
    this.count.update(value => value + 1);
  }
}
```

### Création d'un Service

```typescript
import { Injectable, signal, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly apiService = inject(ApiService);
  
  // État global avec signals
  readonly data = signal<DataType[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  
  // Méthodes CRUD
  getData(): Observable<DataType[]> {
    this.loading.set(true);
    this.error.set(null);
    
    return this.apiService.get<DataType[]>('/data').pipe(
      tap(data => {
        this.data.set(data);
        this.loading.set(false);
      }),
      catchError(error => {
        this.error.set(error.message);
        this.loading.set(false);
        return throwError(error);
      })
    );
  }
  
  addItem(item: DataType): Observable<DataType> {
    return this.apiService.post<DataType>('/data', item).pipe(
      tap(newItem => {
        this.data.update(items => [...items, newItem]);
      })
    );
  }
}
```

## Gestion d'État

### Signals vs Observables

**Utilisez Signals pour :**
- État local des composants
- Valeurs calculées (computed)
- Réactions aux changements (effects)

**Utilisez Observables pour :**
- Appels HTTP
- Événements asynchrones
- Streams de données

### Conversion Observable → Signal

```typescript
import { toSignal } from '@angular/core/rxjs-interop';

@Component({...})
export class MyComponent {
  private readonly service = inject(DataService);
  
  // Conversion d'un Observable en Signal
  readonly data = toSignal(this.service.getData(), {
    initialValue: []
  });
}
```

## Tests

### Tests Unitaires

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

describe('ExampleComponent', () => {
  let component: ExampleComponent;
  let fixture: ComponentFixture<ExampleComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(ExampleComponent);
    component = fixture.componentInstance;
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should increment count', () => {
    const initialCount = component.count();
    component.increment();
    expect(component.count()).toBe(initialCount + 1);
  });
  
  it('should compute double count', () => {
    component.count.set(5);
    expect(component.doubleCount()).toBe(10);
  });
});
```

### Tests de Services

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService]
    });
    
    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  it('should fetch data', () => {
    const mockData = [{ id: 1, name: 'Test' }];
    
    service.getData().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(service.data()).toEqual(mockData);
    });
    
    const req = httpMock.expectOne('/api/data');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
```

## Linting et Formatage

### ESLint Configuration

```json
{
  "extends": [
    "@angular-eslint/recommended",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@angular-eslint/component-selector": [
      "error",
      {
        "prefix": "pmt",
        "style": "kebab-case"
      }
    ],
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn"
  }
}
```

### Scripts de Qualité

```bash
# Linting
npm run lint

# Tests
npm test

# Tests en mode watch (modifier package.json si nécessaire)
npm run test -- --watch

# Couverture de code (modifier package.json si nécessaire)
npm run test -- --coverage
```

## Debugging

### Angular DevTools

1. Installer l'extension Chrome
2. Ouvrir les DevTools
3. Onglet "Angular" pour :
   - Inspecter les composants
   - Voir l'état des signals
   - Profiler les performances

### Console Debugging

```typescript
// Dans un composant
constructor() {
  effect(() => {
    console.log('Signal changed:', this.data());
  });
}

// Dans un service
getData(): Observable<DataType[]> {
  return this.apiService.get<DataType[]>('/data').pipe(
    tap(data => console.log('Data received:', data)),
    catchError(error => {
      console.error('Error:', error);
      return throwError(error);
    })
  );
}
```

## Bonnes Pratiques

### Performance

- **OnPush Change Detection** : Toujours utiliser
- **Signals** : Préférer aux Observables pour l'état local
- **Computed** : Pour les valeurs dérivées
- **TrackBy** : Dans les boucles *ngFor

### Sécurité

- **Sanitization** : Angular le fait automatiquement
- **XSS Protection** : Éviter innerHTML non sécurisé
- **CSRF** : Géré par l'intercepteur
- **Validation** : Côté client ET serveur

### Accessibilité

- **ARIA Labels** : Pour les éléments interactifs
- **Navigation Clavier** : Support complet
- **Contraste** : Respecter les standards WCAG
- **Screen Readers** : Tester avec NVDA/JAWS

## Déploiement

### Build de Production

```bash
# Build optimisé
npm run build

# Analyse du bundle (nécessite d'ajouter --stats-json au script build)
npm run build -- --stats-json
npx webpack-bundle-analyzer dist/project-management-tool/stats.json
```

### Variables d'Environnement

```typescript
// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.production.com',
  logLevel: 'error'
};
```

## Ressources

### Documentation Officielle

- [Angular Documentation](https://angular.io/docs)
- [Angular Signals Guide](https://angular.io/guide/signals)
- [Angular Testing Guide](https://angular.io/guide/testing)

### Outils Recommandés

- **VS Code** : Avec extensions Angular
- **Angular DevTools** : Extension Chrome
- **Prettier** : Formatage automatique
- **ESLint** : Linting du code

---

**Références :**
- [Architecture](architecture.md)
- [API Documentation](api.md)
- [Déploiement](deployment.md)
