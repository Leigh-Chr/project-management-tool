# Guide de Développement Backend - PMT

## Configuration de l'Environnement

### Prérequis

- **Java 17+** (OpenJDK recommandé)
- **Maven 3.6+**
- **MySQL 8.0+** ou Docker
- **IDE** : IntelliJ IDEA, Eclipse, ou VS Code
- **Git** pour le versioning

### Installation Rapide

```bash
# 1. Cloner le projet
git clone <repository-url>
cd project-management-tool/backend

# 2. Démarrer MySQL (Docker)
docker run -d --name pmt-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=project_management \
  -p 3306:3306 mysql:8.0

# 3. Lancer l'application
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

## Structure du Code

### Conventions de Nommage

#### Packages
```java
com.projectmanagementtool.backend.
├── controller     // Contrôleurs REST (suffixe Controller)
├── service        // Services métier (interface + impl)
├── repository     // Repositories Spring Data
├── model          // Entités JPA (noms singuliers)
├── dto            // DTOs (suffixes Dto, RequestDto)
├── mapper         // Mappers (suffixe Mapper)
├── config         // Configuration Spring
├── security       // Sécurité JWT
└── exception      // Exceptions métier
```

#### Classes
- **Entités** : `User`, `Project`, `Task` (singulier)
- **DTOs** : `UserDto`, `ProjectRequestDto`, `TaskDetailsDto`
- **Services** : `UserService` (interface) + `UserServiceImpl`
- **Controllers** : `UserController`, `ProjectController`
- **Repositories** : `UserRepository`, `ProjectRepository`

### Annotations Standards

#### Entités JPA
```java
@Entity
@Table(name = "users")
@Data  // Lombok pour getters/setters
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50)
    @Column(nullable = false, unique = true)
    private String username;
}
```

#### Contrôleurs REST
```java
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor  // Lombok pour injection
@Slf4j  // Lombok pour logging
public class UserController {
    
    private final UserService userService;
    
    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        log.info("Getting all users");
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
```

#### Services
```java
@Service
@RequiredArgsConstructor
@Transactional  // Gestion des transactions
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    
    @Override
    @Transactional(readOnly = true)  // Lecture seule
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
```

## Développement avec Spring Boot

### Profils de Configuration

#### Development (application-dev.properties)
```properties
# Base de données locale
spring.datasource.url=jdbc:mysql://localhost:3306/project_management
spring.jpa.show-sql=true
logging.level.com.projectmanagementtool=DEBUG

# DevTools pour rechargement automatique
spring.devtools.restart.enabled=true
```

#### Production (application-prod.properties)
```properties
# Variables d'environnement
spring.datasource.url=${DATABASE_URL}
spring.jpa.show-sql=false
logging.level.com.projectmanagementtool=INFO
```

### Hot Reload

Avec Spring Boot DevTools :
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

### Base de Données

#### Migrations Flyway
```bash
# Nouvelle migration
src/main/resources/db/migration/V5__add_new_feature.sql

# Réparation des checksums (après modification)
./mvnw flyway:repair

# Information sur les migrations
./mvnw flyway:info
```

#### Accès Direct
```bash
# Via Docker
docker exec -it pmt-mysql mysql -u root -p project_management

# Ou directement
mysql -u root -p project_management
```

## Tests

### Tests Unitaires

#### Service Tests
```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @InjectMocks
    private UserServiceImpl userService;
    
    @Test
    void createUser_ShouldCreateUserSuccessfully() {
        // Given
        when(userRepository.save(any())).thenReturn(testUser);
        
        // When
        User result = userService.createUser(testUser);
        
        // Then
        assertNotNull(result);
        verify(userRepository).save(any());
    }
}
```

#### Repository Tests
```java
@DataJpaTest
class UserRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private UserRepository userRepository;
    
    @Test
    void findByEmail_ShouldReturnUser_WhenExists() {
        // Given
        User user = new User();
        user.setEmail("test@example.com");
        entityManager.persistAndFlush(user);
        
        // When
        Optional<User> result = userRepository.findByEmail("test@example.com");
        
        // Then
        assertTrue(result.isPresent());
    }
}
```

### Tests d'Intégration

#### Controller Tests
```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AuthControllerIntegrationTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void login_ShouldReturnToken_WhenValidCredentials() {
        // Given
        AuthRequest request = new AuthRequest();
        request.setEmail("admin@example.com");
        request.setPassword("admin123");
        
        // When
        ResponseEntity<AuthResponse> response = restTemplate.postForEntity(
            "/api/auth/login", request, AuthResponse.class);
        
        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody().getToken());
    }
}
```

### Couverture de Code

```bash
# Exécuter les tests avec couverture
./mvnw clean test jacoco:report

# Voir le rapport
open target/site/jacoco/index.html
```

## Debugging

### Logs de Développement

```properties
# Configuration détaillée pour debugging
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
logging.level.org.springframework.security=DEBUG
```

### Debugging JPA

```java
// Dans application-dev.properties
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.use_sql_comments=true
```

### Debugging Sécurité

```java
// Logs détaillés JWT
@Slf4j
public class JwtAuthenticationFilter {
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) {
        log.debug("Processing request: {}", request.getRequestURI());
        // ...
    }
}
```

## Bonnes Pratiques

### Gestion des Erreurs

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
            ResourceNotFoundException ex) {
        ErrorResponse error = ErrorResponse.builder()
            .error("RESOURCE_NOT_FOUND")
            .message(ex.getMessage())
            .statusCode(404)
            .timestamp(LocalDateTime.now().toString())
            .build();
        return ResponseEntity.status(404).body(error);
    }
}
```

### Validation des Données

```java
@PostMapping
public ResponseEntity<ProjectDto> createProject(
        @Valid @RequestBody ProjectRequestDto request) {
    // @Valid déclenche automatiquement la validation Bean
    return ResponseEntity.ok(projectService.createProject(request));
}
```

### Transactions

```java
@Service
@Transactional  // Transaction par défaut sur toute la classe
public class TaskServiceImpl {
    
    @Transactional(readOnly = true)  // Optimisation lecture
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }
    
    @Transactional(rollbackFor = Exception.class)  // Rollback explicite
    public Task createTask(TaskRequestDto request) {
        // Logique de création
    }
}
```

## Outils de Développement

### Maven Plugins Utiles

```bash
# Compilation
./mvnw compile

# Tests avec couverture
./mvnw test jacoco:report

# Analyse de code
./mvnw pmd:check

# Démarrage avec profil
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Package pour production
./mvnw clean package -Pprod
```

### IDE Configuration

#### IntelliJ IDEA
- **Lombok Plugin** : Obligatoire pour @Data, @RequiredArgsConstructor
- **Spring Boot Plugin** : Pour le support Spring
- **Database Tools** : Connexion directe à MySQL

#### VS Code
- **Extension Pack for Java**
- **Spring Boot Extension Pack**
- **MySQL Extension**

## Workflow de Développement

### 1. Nouvelle Fonctionnalité

```bash
# 1. Créer une branche
git checkout -b feature/new-feature

# 2. Créer/modifier les entités JPA
# 3. Créer les DTOs et mappers
# 4. Implémenter le service
# 5. Créer le contrôleur
# 6. Ajouter les tests
# 7. Créer la migration Flyway si nécessaire
```

### 2. Nouvelle Entité

```java
// 1. Entité JPA
@Entity
@Table(name = "new_entities")
public class NewEntity { ... }

// 2. Repository
public interface NewEntityRepository extends JpaRepository<NewEntity, Long> { ... }

// 3. DTOs
public class NewEntityDto { ... }
public class NewEntityRequestDto { ... }

// 4. Mapper
@Component
public class NewEntityMapper { ... }

// 5. Service
public interface NewEntityService { ... }
@Service
public class NewEntityServiceImpl { ... }

// 6. Controller
@RestController
@RequestMapping("/api/new-entities")
public class NewEntityController { ... }

// 7. Tests
public class NewEntityServiceTest { ... }
```

### 3. Migration de Base de Données

```sql
-- V5__add_new_entity.sql
CREATE TABLE new_entities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index si nécessaire
CREATE INDEX idx_new_entities_name ON new_entities(name);
```

## Troubleshooting

### Problèmes Courants

#### Flyway Checksum Mismatch
```bash
# Solution : Réparer les checksums
./mvnw flyway:repair

# Ou recréer la base
mysql -u root -p -e "DROP DATABASE project_management; CREATE DATABASE project_management;"
```

#### Port 8080 Already in Use
```bash
# Trouver et tuer le processus
lsof -ti:8080 | xargs kill -9

# Ou changer le port
server.port=8081
```

#### JWT Token Issues
```bash
# Vérifier la configuration
jwt.secret=your-secret-key
jwt.expiration=86400000

# Logs détaillés
logging.level.com.projectmanagementtool.backend.security=DEBUG
```

### Commandes Utiles

```bash
# Logs en temps réel
tail -f spring-boot.log

# Tests spécifiques
./mvnw test -Dtest=UserServiceTest

# Compilation sans tests
./mvnw compile -DskipTests

# Clean complet
./mvnw clean
```

## Performance

### Optimisations JPA

```java
// Fetch strategies optimisées
@ManyToOne(fetch = FetchType.LAZY)  // Par défaut
@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)

// Requêtes personnalisées
@Query("SELECT t FROM Task t JOIN FETCH t.assignee WHERE t.project.id = :projectId")
List<Task> findTasksWithAssigneesByProjectId(@Param("projectId") Long projectId);
```

### Configuration HikariCP

```properties
# Pool de connexions optimisé
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
```

---

**Références :**
- [Architecture](architecture.md)
- [API Documentation](api.md)
- [Tests et Qualité](testing.md)
- [Frontend Development Guide](../../frontend/docs/development.md)
