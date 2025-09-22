#!/bin/bash

echo "🐳 Test de déploiement Docker - Project Management Tool"
echo "======================================================"

# Vérifier Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    exit 1
fi

echo "✅ Docker est installé: $(docker --version)"

# Test de build du backend
echo ""
echo "🔨 Test de build du backend..."
cd backend
if docker build -t pmt-backend-test .; then
    echo "✅ Backend build réussi"
else
    echo "❌ Backend build échoué"
    exit 1
fi

# Test de build du frontend
echo ""
echo "🔨 Test de build du frontend..."
cd ../frontend
if docker build -t pmt-frontend-test .; then
    echo "✅ Frontend build réussi"
else
    echo "❌ Frontend build échoué"
    exit 1
fi

echo ""
echo "🎉 Tous les builds Docker sont réussis !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Installer Docker Compose : sudo apt install docker-compose-plugin"
echo "2. Ou utiliser : docker run pour chaque service"
echo "3. Configurer les variables d'environnement"
echo "4. Tester l'application complète"

cd ..
