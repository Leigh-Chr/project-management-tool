#!/bin/bash

# Script de démarrage pour le développement
echo "🚀 Démarrage du Project Management Tool Backend - Mode Développement"

# Vérifier si Docker est en cours d'exécution
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker n'est pas en cours d'exécution. Veuillez démarrer Docker."
    exit 1
fi

# Démarrer MySQL avec Docker Compose
echo "📦 Démarrage de MySQL..."
docker-compose up -d mysql

# Attendre que MySQL soit prêt
echo "⏳ Attente de MySQL..."
until docker-compose exec mysql mysqladmin ping -h "localhost" --silent; do
    echo "   MySQL n'est pas encore prêt..."
    sleep 2
done

echo "✅ MySQL est prêt!"

# Démarrer l'application Spring Boot
echo "🌟 Démarrage de l'application Spring Boot..."
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

echo "🎉 L'application est démarrée!"
echo "📊 API disponible sur: http://localhost:8080"
echo "🗄️  PhpMyAdmin disponible sur: http://localhost:8081"
