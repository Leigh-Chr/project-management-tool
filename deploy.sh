#!/bin/bash

echo "🐳 Déploiement Project Management Tool"
echo "======================================"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les logs colorés
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Arrêter les conteneurs existants
log_info "Arrêt des conteneurs existants..."
docker stop pmt-mysql pmt-backend pmt-frontend 2>/dev/null || true
docker rm pmt-mysql pmt-backend pmt-frontend 2>/dev/null || true

# Créer le réseau
log_info "Création du réseau Docker..."
docker network create pmt-network 2>/dev/null || true

# Démarrer MySQL
log_info "Démarrage de MySQL..."
docker run -d \
    --name pmt-mysql \
    --network pmt-network \
    -e MYSQL_ROOT_PASSWORD=root \
    -e MYSQL_DATABASE=project_management \
    -e MYSQL_USER=pmt_user \
    -e MYSQL_PASSWORD=pmt_password \
    -p 3306:3306 \
    mysql:8.0

# Attendre que MySQL soit prêt
log_info "Attente du démarrage de MySQL..."
sleep 30

# Démarrer le backend
log_info "Démarrage du backend..."
docker run -d \
    --name pmt-backend \
    --network pmt-network \
    -e SPRING_PROFILES_ACTIVE=prod \
    -e DATABASE_URL=jdbc:mysql://pmt-mysql:3306/project_management \
    -e DB_USERNAME=pmt_user \
    -e DB_PASSWORD=pmt_password \
    -e JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970 \
    -e CORS_ORIGINS=http://localhost:4200 \
    -p 8080:8080 \
    pmt-backend-test

# Attendre que le backend soit prêt
log_info "Attente du démarrage du backend..."
sleep 20

# Démarrer le frontend
log_info "Démarrage du frontend..."
docker run -d \
    --name pmt-frontend \
    --network pmt-network \
    -e API_URL=http://localhost:8080/api \
    -p 4200:80 \
    pmt-frontend-test

log_info "Déploiement terminé !"
echo ""
echo "🌐 Services disponibles :"
echo "  Frontend:    http://localhost:4200"
echo "  Backend API: http://localhost:8080"
echo "  Database:    localhost:3306"
echo ""
echo "📋 Comptes de test :"
echo "  Email: alice@example.com"
echo "  Password: alice123"
echo ""
echo "🔧 Commandes utiles :"
echo "  Voir les logs: docker logs pmt-backend"
echo "  Arrêter: ./stop.sh"
