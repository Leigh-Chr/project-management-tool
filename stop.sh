#!/bin/bash

echo "🛑 Arrêt de l'application Project Management Tool"
echo "================================================"

# Arrêter et supprimer les conteneurs
echo "Arrêt des conteneurs..."
docker stop pmt-frontend pmt-backend pmt-mysql 2>/dev/null || true
docker rm pmt-frontend pmt-backend pmt-mysql 2>/dev/null || true

# Supprimer le réseau
echo "Suppression du réseau..."
docker network rm pmt-network 2>/dev/null || true

echo "✅ Application arrêtée avec succès"
