#!/bin/bash

echo "🚀 Déploiement Simple PMT"
echo "========================="

# Arrêter les conteneurs existants
echo "🧹 Nettoyage..."
docker stop pmt-frontend pmt-backend pmt-mysql 2>/dev/null || true
docker rm pmt-frontend pmt-backend pmt-mysql 2>/dev/null || true

# Créer le réseau
echo "🌐 Création du réseau..."
docker network create pmt-network 2>/dev/null || true

# Démarrer MySQL
echo "🗄️ Démarrage MySQL..."
docker run -d \
  --name pmt-mysql \
  --network pmt-network \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=root_password \
  -e MYSQL_DATABASE=pmt_db \
  -e MYSQL_USER=pmt_user \
  -e MYSQL_PASSWORD=pmt_password \
  mysql:8.0

# Attendre MySQL
echo "⏳ Attente MySQL..."
sleep 30

# Construire et démarrer le backend
echo "🔨 Construction Backend..."
cd backend
./mvnw clean package -DskipTests
cd ..

echo "🚀 Démarrage Backend..."
docker run -d \
  --name pmt-backend \
  --network pmt-network \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://pmt-mysql:3306/pmt_db?useSSL=false&allowPublicKeyRetrieval=true \
  -e SPRING_DATASOURCE_USERNAME=pmt_user \
  -e SPRING_DATASOURCE_PASSWORD=pmt_password \
  -e JWT_SECRET=yourVerySecretKeyThatIsAtLeast256BitsLongAndShouldBeStoredSecurely \
  -v $(pwd)/backend/target/backend-0.0.1-SNAPSHOT.jar:/app/app.jar \
  openjdk:17-jdk-slim \
  java -jar /app/app.jar

# Attendre le backend
echo "⏳ Attente Backend..."
sleep 20

# Construire et démarrer le frontend
echo "🔨 Construction Frontend..."
cd frontend
npm ci
npm run build
cd ..

echo "🚀 Démarrage Frontend..."
docker run -d \
  --name pmt-frontend \
  --network pmt-network \
  -p 4200:80 \
  -v $(pwd)/frontend/dist/project-management-tool/browser:/usr/share/nginx/html \
  nginx:alpine

echo ""
echo "✅ Déploiement terminé !"
echo ""
echo "🌐 Application disponible :"
echo "  Frontend: http://localhost:4200"
echo "  Backend:  http://localhost:8080"
echo ""
echo "📊 Comptes de test :"
echo "  Email: admin@example.com"
echo "  Password: admin123"
echo ""
echo "🔧 Commandes utiles :"
echo "  Voir logs: docker logs pmt-backend"
echo "  Arrêter:   ./stop.sh"