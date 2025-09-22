# Architecture Backend - Project Management Tool

## Vue d'ensemble

Le backend PMT suit une architecture Spring Boot en couches avec une séparation claire des responsabilités, une sécurité JWT robuste et une approche moderne utilisant JPA/Hibernate.

## Structure du Projet

```
src/main/java/com/projectmanagementtool/backend/
├── config/                  # Configuration Spring
│   ├── ApplicationConfig.java    # Configuration générale
│   ├── JpaConfig.java           # Configuration JPA
│   └── SecurityConfig.java      # Configuration sécurité JWT
├── controller/              # Contrôleurs REST
│   ├── AuthController.java      # Authentification
│   ├── ProjectController.java   # Gestion des projets
│   ├── TaskController.java      # Gestion des tâches
│   ├── UserController.java      # Gestion des utilisateurs
│   └── ...
├── dto/                     # Data Transfer Objects
│   ├── AuthRequest.java         # Requêtes d'authentification
│   ├── ProjectDto.java          # DTOs des projets
│   ├── TaskDto.java             # DTOs des tâches
│   └── ...
├── exception/               # Gestion d'erreurs
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   └── UnauthorizedException.java
├── mapper/                  # Conversion Entity ↔ DTO
│   ├── ProjectMapper.java
│   ├── TaskMapper.java
│   └── ...
├── model/                   # Entités JPA
│   ├── User.java               # Utilisateurs
│   ├── Project.java            # Projets
│   ├── Task.java               # Tâches
│   └── ...
├── repository/              # Repositories Spring Data
│   ├── UserRepository.java
│   ├── ProjectRepository.java
│   └── ...
├── security/                # Sécurité JWT
│   ├── JwtService.java         # Gestion des tokens
│   ├── JwtAuthenticationFilter.java
│   └── SecurityUtils.java
└── service/                 # Services métier
    ├── UserService.java
    ├── ProjectService.java
    └── impl/               # Implémentations
```

## Architecture en Couches

### Pattern MVC Spring Boot

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controllers   │ -> │    Services     │ -> │  Repositories   │
│   (REST API)    │    │  (Business)     │    │   (Data)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         v                       v                       v
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      DTOs       │    │    Entities     │    │     MySQL       │
│  (Transfer)     │    │    (JPA)        │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Couche Controller (REST)

Chaque contrôleur suit une structure cohérente :

```java
@RestController
@RequestMapping("/api/entity")
@RequiredArgsConstructor
public class EntityController {
    private final EntityService entityService;
    
    @GetMapping
    public ResponseEntity<List<EntityDto>> getAll() {
        return ResponseEntity.ok(entityService.getAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<EntityDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(entityService.getById(id));
    }
    
    @PostMapping
    public ResponseEntity<EntityDto> create(@Valid @RequestBody EntityRequestDto request) {
        return ResponseEntity.ok(entityService.create(request));
    }
}
```

### Couche Service (Métier)

Les services encapsulent la logique métier :

```java
@Service
@RequiredArgsConstructor
@Transactional
public class EntityServiceImpl implements EntityService {
    private final EntityRepository repository;
    private final EntityMapper mapper;
    private final SecurityUtils securityUtils;
    
    @Override
    @Transactional(readOnly = true)
    public List<EntityDto> getAll() {
        // Logique métier avec vérification des permissions
        return repository.findAll().stream()
            .map(mapper::toDto)
            .collect(Collectors.toList());
    }
}
```

### Couche Repository (Données)

Les repositories étendent Spring Data JPA :

```java
@Repository
public interface EntityRepository extends JpaRepository<Entity, Long> {
    Optional<Entity> findByName(String name);
    List<Entity> findByStatusId(Long statusId);
    
    @Query("SELECT e FROM Entity e WHERE e.user.id = :userId")
    List<Entity> findByUserId(@Param("userId") Long userId);
}
```

## Sécurité JWT

### Architecture de Sécurité

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │ -> │  JWT Filter     │ -> │  Controllers    │
│  (Angular)      │    │ (Validation)    │    │   (Protected)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         v                       v                       v
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   JWT Token     │    │ SecurityContext │    │   User Details  │
│  (Bearer)       │    │   (Spring)      │    │   (Loaded)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Flux d'Authentification

1. **Login** → AuthController.login()
2. **Validation** → UserDetailsService.loadUserByUsername()
3. **Token Generation** → JwtService.generateToken()
4. **Response** → JWT + User Info
5. **Subsequent Requests** → JwtAuthenticationFilter
6. **Token Validation** → JwtService.validateToken()
7. **SecurityContext** → User authenticated

### Configuration JWT

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        return http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/api/health").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
```

## Modèle de Données JPA

### Relations Entités (Corrigées)

```
User (1) ←→ (N) ProjectMember (N) ←→ (1) Project
  ↑                    ↓                    ↓
  │                    ↓                    ↓
  │               Role (1)                  ↓
  │                                        ↓
  └─────────── (N) ←→ Task (N) ←→ (1) Status
                       ↓
                       ↓
              TaskEvent (N)
```

### Entité Task (Relation Critique Corrigée)

```java
@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
    
    // CORRECTION CRITIQUE : Relation directe vers User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id")
    private User assignee;  // ✅ CORRIGÉ : User au lieu de ProjectMember
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "status_id", nullable = false)
    private Status status;
}
```

## Gestion des Données

### Migrations Flyway

1. **V1__init_schema.sql** : Création des tables avec relations corrigées
2. **V2__add_indexes.sql** : Index pour les performances
3. **V3__insert_initial_data.sql** : Données de test cohérentes
4. **V4__remove_timestamps.sql** : Nettoyage du schéma

### Données de Test Cohérentes

```sql
-- Utilisateurs
(1, 'admin'), (2, 'alice'), (3, 'bob'), (4, 'charlie'), (5, 'diana')

-- Tâches avec assignation correcte vers users.id
(1, 1, 'Design Homepage', ..., 2, 3),        -- alice (users.id=2)
(2, 1, 'Implement Payment Gateway', ..., 3, 2), -- bob (users.id=3)
(3, 1, 'Product Catalog', ..., 2, 1),       -- alice (users.id=2)
```

## API REST

### Endpoints Principaux

#### Authentification
- `POST /api/auth/login` : Connexion avec JWT
- `POST /api/auth/register` : Inscription
- `POST /api/auth/logout` : Déconnexion

#### Projets
- `GET /api/projects` : Liste des projets avec rôle utilisateur
- `GET /api/projects/{id}/details` : Détails complets (membres + tâches)
- `POST /api/projects` : Création de projet

#### Tâches
- `GET /api/tasks` : Liste des tâches avec assignees
- `POST /api/tasks` : Création avec assignation
- `PATCH /api/tasks/{id}` : Modification avec historique

### Format des Réponses

Toutes les réponses suivent le format JSON défini dans le contrat API :

```json
{
  "id": 1,
  "name": "Task Name",
  "assignee": {
    "id": 2,
    "username": "alice",
    "email": "alice@example.com",
    "role": "Member"
  },
  "taskHistory": [...]
}
```

## Performance

### Optimisations JPA

- **Lazy Loading** : Relations chargées à la demande
- **Fetch Strategies** : Optimisées pour chaque cas d'usage
- **Query Optimization** : Index sur toutes les clés étrangères
- **Connection Pool** : HikariCP configuré

### Index de Base de Données

```sql
-- Index critiques pour les performances
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_project_members_user_id ON project_members(user_id);
CREATE INDEX idx_tasks_project_status ON tasks(project_id, status_id);
```

## Sécurité

### Authentification
- **JWT Tokens** : Authentification stateless
- **Password Hashing** : BCrypt avec salt
- **Token Expiration** : 24h par défaut
- **CORS** : Configuré pour le frontend Angular

### Autorisation
- **Method Security** : `@PreAuthorize` sur les services
- **Role-based** : Admin, Member, Observer
- **Resource-based** : Vérification des permissions par projet
- **SQL Injection Protection** : JPA Repositories

### Validation
- **Bean Validation** : `@Valid` sur tous les DTOs
- **Custom Validators** : Contraintes métier
- **Exception Handling** : GlobalExceptionHandler
- **Input Sanitization** : Automatique avec Spring

## Monitoring et Logs

### Configuration des Logs

```properties
# Development
logging.level.com.projectmanagementtool=DEBUG
logging.level.org.hibernate.SQL=DEBUG

# Production  
logging.level.com.projectmanagementtool=INFO
logging.level.org.hibernate=WARN
```

### Métriques Disponibles

- **Endpoint Health** : `/api/health`
- **JPA Metrics** : Hibernate statistics
- **Security Events** : Login/logout logs
- **Error Tracking** : Global exception handler

## Évolutivité

### Modularité

- **Packages** : Organisation logique par domaine
- **Interfaces** : Contrats clairs entre couches
- **Dependency Injection** : Spring IoC
- **Configuration** : Externalisée par profils

### Extensibilité

- **New Entities** : Pattern cohérent à suivre
- **Custom Repositories** : Requêtes métier spécialisées
- **Event Handling** : Spring Events pour les notifications
- **Caching** : Préparé pour Spring Cache

## Tests

### Stratégie de Tests

- **Unit Tests** : Services avec mocks
- **Integration Tests** : Contrôleurs avec TestRestTemplate
- **Repository Tests** : `@DataJpaTest`
- **Security Tests** : `@WithMockUser`

### Outils de Test

- **JUnit 5** : Framework de test principal
- **Mockito** : Mocking des dépendances
- **Spring Boot Test** : Context de test
- **TestContainers** : Tests avec base réelle (optionnel)

## Corrections Appliquées

### Relation TaskEntity.assigneeId

**AVANT (Incorrect)** :
```java
@ManyToOne
@JoinColumn(name = "assignee_id")
private ProjectMember assignee;  // ❌ Relation indirecte
```

**APRÈS (Correct)** :
```java
@ManyToOne
@JoinColumn(name = "assignee_id") 
private User assignee;  // ✅ Relation directe vers User
```

### Cohérence avec Frontend

- ✅ **data-model.md** : TaskEntity.assigneeId → UserEntity.id
- ✅ **api-contract.md** : Structures de réponse avec assignee.username
- ✅ **Tests validés** : Toutes les relations fonctionnent

## Déploiement

### Environnements

- **Development** : `application-dev.properties`
- **Production** : `application-prod.properties`
- **Docker** : `docker-compose.yml` avec MySQL

### Variables d'Environnement

```properties
# Production
DATABASE_URL=jdbc:mysql://host:port/database
DB_USERNAME=username
DB_PASSWORD=password
JWT_SECRET=your-production-secret
```

---

**Références :**
- [Guide de développement](development.md)
- [API Documentation](api.md)
- [Modèle de données](data-model.md)
- [Frontend Architecture](../../frontend/docs/architecture.md)
