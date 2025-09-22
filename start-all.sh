#!/bin/bash

echo "🚀 Démarrage complet Project Management Tool"

# Vérifier les prérequis
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker requis mais non disponible"
    exit 1
fi

if ! command -v node > /dev/null 2>&1; then
    echo "❌ Node.js requis mais non disponible"
    exit 1
fi

# Démarrer MySQL
echo "📦 Démarrage MySQL..."
docker run -d --name pmt-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=project_management \
  -p 3306:3306 mysql:8.0 2>/dev/null || echo "   MySQL déjà en cours"

# Attendre MySQL
echo "⏳ Attente MySQL..."
until docker exec pmt-mysql mysqladmin ping -h "localhost" --silent 2>/dev/null; do
    echo "   MySQL pas encore prêt..."
    sleep 3
done
echo "✅ MySQL prêt"

# Démarrer Backend
echo "⚙️ Démarrage Backend Spring Boot..."
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev > spring-boot.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > .backend.pid

# Attendre Backend
echo "⏳ Attente Backend..."
until curl -f http://localhost:8080/api/health > /dev/null 2>&1; do
    echo "   Backend pas encore prêt..."
    sleep 3
done
echo "✅ Backend prêt"

# Démarrer Frontend
echo "🎨 Démarrage Frontend Angular..."
cd ../frontend

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances npm..."
    npm install
fi

npm start > angular.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > .frontend.pid

echo ""
echo "🎉 Project Management Tool démarré avec succès!"
echo ""
echo "📱 Services disponibles :"
echo "   🌐 Frontend:    http://localhost:4200"
echo "   ⚙️ Backend API: http://localhost:8080"
echo "   🗄️ PhpMyAdmin:  http://localhost:8081 (root/root)"
echo "   📊 MySQL:       localhost:3306 (root/root)"
echo ""
echo "👤 Comptes de test :"
echo "   admin@example.com / admin123 (Admin)"
echo "   alice@example.com / alice123 (Member)"
echo "   bob@example.com / bob123 (Member)"
echo ""
echo "🛑 Pour arrêter : ./stop-all.sh"
echo "📚 Documentation : docs/index.md"
echo ""
