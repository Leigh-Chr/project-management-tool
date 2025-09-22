# Dockerfile simple pour Spring Boot
FROM openjdk:17-jdk-slim

# Créer un utilisateur non-root
RUN addgroup --system spring && adduser --system spring --ingroup spring

# Définir le répertoire de travail
WORKDIR /app

# Copier le JAR (construit localement ou par CI/CD)
COPY target/backend-0.0.1-SNAPSHOT.jar app.jar

# Changer le propriétaire
RUN chown spring:spring app.jar
USER spring:spring

# Exposer le port
EXPOSE 8080

# Variables d'environnement
ENV SPRING_PROFILES_ACTIVE=prod

# Commande de démarrage
CMD ["java", "-jar", "app.jar"]