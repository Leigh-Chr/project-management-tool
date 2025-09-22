#!/bin/bash

echo "🛑 Arrêt PMT"
echo "============"

echo "🧹 Arrêt des conteneurs..."
docker stop pmt-frontend pmt-backend pmt-mysql 2>/dev/null || true

echo "🗑️ Suppression des conteneurs..."
docker rm pmt-frontend pmt-backend pmt-mysql 2>/dev/null || true

echo "🌐 Suppression du réseau..."
docker network rm pmt-network 2>/dev/null || true

echo "✅ Application arrêtée !"