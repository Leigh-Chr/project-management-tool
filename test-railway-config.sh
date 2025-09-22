#!/bin/bash

# Script de test pour vérifier la configuration Railway
# Ce script teste que la configuration est prête pour Railway

echo "🚀 Test de la configuration Railway..."
echo "=================================="

# Vérifier que les fichiers railway.toml existent
echo "📁 Vérification des fichiers railway.toml..."

if [ -f "railway.toml" ]; then
    echo "✅ railway.toml (root) : OK"
else
    echo "❌ railway.toml (root) : MANQUANT"
    exit 1
fi

if [ -f "backend/railway.toml" ]; then
    echo "✅ backend/railway.toml : OK"
else
    echo "❌ backend/railway.toml : MANQUANT"
    exit 1
fi

if [ -f "frontend/railway.toml" ]; then
    echo "✅ frontend/railway.toml : OK"
else
    echo "❌ frontend/railway.toml : MANQUANT"
    exit 1
fi

# Vérifier les fichiers de configuration
echo ""
echo "📋 Vérification des fichiers de configuration..."

if [ -f "backend/pom.xml" ]; then
    echo "✅ backend/pom.xml : OK"
else
    echo "❌ backend/pom.xml : MANQUANT"
    exit 1
fi

if [ -f "frontend/package.json" ]; then
    echo "✅ frontend/package.json : OK"
else
    echo "❌ frontend/package.json : MANQUANT"
    exit 1
fi

# Vérifier les variables d'environnement
echo ""
echo "🔧 Vérification des variables d'environnement..."

if [ -f "backend/src/main/resources/application-prod.properties" ]; then
    echo "✅ application-prod.properties : OK"
else
    echo "❌ application-prod.properties : MANQUANT"
    exit 1
fi

if [ -f "frontend/src/environments/environment.prod.ts" ]; then
    echo "✅ environment.prod.ts : OK"
else
    echo "❌ environment.prod.ts : MANQUANT"
    exit 1
fi

# Test de compilation backend
echo ""
echo "🔨 Test de compilation backend..."
cd backend
if mvn clean compile -q; then
    echo "✅ Compilation backend : OK"
else
    echo "❌ Compilation backend : ÉCHEC"
    cd ..
    exit 1
fi
cd ..

# Test de compilation frontend
echo ""
echo "🔨 Test de compilation frontend..."
cd frontend
if npm run build -- --configuration=production > /dev/null 2>&1; then
    echo "✅ Build frontend : OK"
else
    echo "❌ Build frontend : ÉCHEC"
    cd ..
    exit 1
fi
cd ..

echo ""
echo "🎉 Configuration Railway : PRÊTE !"
echo "=================================="
echo ""
echo "📋 Prochaines étapes :"
echo "1. Créer 2 projets Railway séparés"
echo "2. Configurer les variables d'environnement"
echo "3. Déployer backend puis frontend"
echo ""
echo "📖 Voir docs/deployment.md pour les instructions complètes"
