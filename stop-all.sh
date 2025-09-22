#!/bin/bash

echo "🛑 Arrêt complet Project Management Tool"

# Arrêter Frontend
if [ -f frontend/.frontend.pid ]; then
    FRONTEND_PID=$(cat frontend/.frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        echo "🎨 Arrêt Frontend Angular..."
        kill $FRONTEND_PID 2>/dev/null
        rm frontend/.frontend.pid
    fi
fi

# Arrêter Backend  
if [ -f backend/.backend.pid ]; then
    BACKEND_PID=$(cat backend/.backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        echo "⚙️ Arrêt Backend Spring Boot..."
        kill $BACKEND_PID 2>/dev/null
        rm backend/.backend.pid
    fi
fi

# Arrêter MySQL
echo "🗄️ Arrêt MySQL..."
docker stop pmt-mysql 2>/dev/null || echo "   MySQL déjà arrêté"
docker rm pmt-mysql 2>/dev/null || echo "   Container MySQL nettoyé"

echo ""
echo "✅ Project Management Tool arrêté proprement"
echo "📚 Documentation disponible : docs/index.md"
echo "🚀 Redémarrer avec : ./start-all.sh"
echo ""
