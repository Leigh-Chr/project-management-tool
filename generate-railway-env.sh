#!/bin/bash

# Script pour générer les variables d'environnement Railway
# Ce script aide à configurer les variables d'environnement pour Railway

echo "🔧 Générateur de Variables d'Environnement Railway"
echo "================================================"
echo ""

# Générer une clé JWT sécurisée
JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "fallback-jwt-secret-$(date +%s)")

echo "📋 Variables d'Environnement pour le Backend :"
echo "============================================="
echo ""
echo "SPRING_PROFILES_ACTIVE=prod"
echo "SPRING_DATASOURCE_URL=\${{MySQL.MYSQL_URL}}"
echo "SPRING_DATASOURCE_USERNAME=\${{MySQL.MYSQL_USER}}"
echo "SPRING_DATASOURCE_PASSWORD=\${{MySQL.MYSQL_PASSWORD}}"
echo "JWT_SECRET=$JWT_SECRET"
echo "ALLOWED_ORIGINS=https://[FRONTEND_RAILWAY_URL]"
echo ""
echo "⚠️  IMPORTANT : Remplacez [FRONTEND_RAILWAY_URL] par l'URL réelle du frontend"
echo ""

echo "📋 Variables d'Environnement pour le Frontend :"
echo "=============================================="
echo ""
echo "NODE_ENV=production"
echo "API_URL=https://[BACKEND_RAILWAY_URL]/api"
echo ""
echo "⚠️  IMPORTANT : Remplacez [BACKEND_RAILWAY_URL] par l'URL réelle du backend"
echo ""

echo "🔑 Clé JWT générée : $JWT_SECRET"
echo ""
echo "📖 Voir RAILWAY_DEPLOYMENT_GUIDE.md pour les instructions complètes"
