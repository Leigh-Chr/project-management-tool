#!/bin/bash

# Script de test d'intégration Frontend + Backend
# Teste que le frontend Angular communique correctement avec l'API Spring Boot

echo "🧪 Test d'intégration Frontend + Backend"
echo "========================================"

# Configuration
API_URL="http://localhost:8080/api"
FRONTEND_URL="http://localhost:4200"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour tester un endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local auth_header=$4
    local expected_status=$5
    
    echo -n "Testing $method $endpoint... "
    
    if [ -n "$auth_header" ]; then
        response=$(curl -s -w "%{http_code}" -X $method "$API_URL$endpoint" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $auth_header" \
            ${data:+-d "$data"})
    else
        response=$(curl -s -w "%{http_code}" -X $method "$API_URL$endpoint" \
            -H "Content-Type: application/json" \
            ${data:+-d "$data"})
    fi
    
    http_code="${response: -3}"
    body="${response%???}"
    
    if [ "$http_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓${NC} (HTTP $http_code)"
        return 0
    else
        echo -e "${RED}✗${NC} (HTTP $http_code, expected $expected_status)"
        echo "Response: $body"
        return 1
    fi
}

echo -e "\n${YELLOW}1. Test de santé du backend${NC}"
test_endpoint "GET" "/health" "" "" "200"

echo -e "\n${YELLOW}2. Test d'authentification${NC}"
# Login
login_response=$(curl -s -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"alice@example.com","password":"alice123"}')

if echo "$login_response" | grep -q "token"; then
    echo -e "Login: ${GREEN}✓${NC}"
    TOKEN=$(echo "$login_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
else
    echo -e "Login: ${RED}✗${NC}"
    echo "Response: $login_response"
    exit 1
fi

echo -e "\n${YELLOW}3. Test des endpoints protégés${NC}"
test_endpoint "GET" "/projects" "" "$TOKEN" "200"
test_endpoint "GET" "/users" "" "$TOKEN" "200"
test_endpoint "GET" "/statuses" "" "$TOKEN" "200"
test_endpoint "GET" "/roles" "" "$TOKEN" "200"

echo -e "\n${YELLOW}4. Test des détails de projet${NC}"
test_endpoint "GET" "/projects/1" "" "$TOKEN" "200"
test_endpoint "GET" "/projects/1/members" "" "$TOKEN" "200"

echo -e "\n${YELLOW}5. Test des tâches${NC}"
test_endpoint "GET" "/tasks" "" "$TOKEN" "200"
test_endpoint "GET" "/tasks/1" "" "$TOKEN" "200"
test_endpoint "GET" "/tasks/1/details" "" "$TOKEN" "200"

echo -e "\n${YELLOW}6. Test du frontend${NC}"
frontend_status=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")
if [ "$frontend_status" = "200" ]; then
    echo -e "Frontend accessible: ${GREEN}✓${NC} (HTTP $frontend_status)"
else
    echo -e "Frontend accessible: ${RED}✗${NC} (HTTP $frontend_status)"
fi

echo -e "\n${YELLOW}7. Test CORS${NC}"
cors_response=$(curl -s -H "Origin: http://localhost:4200" \
    -H "Access-Control-Request-Method: GET" \
    -H "Access-Control-Request-Headers: authorization" \
    -X OPTIONS "$API_URL/projects")

if echo "$cors_response" | grep -q "Access-Control-Allow-Origin"; then
    echo -e "CORS configuré: ${GREEN}✓${NC}"
else
    echo -e "CORS configuré: ${YELLOW}⚠${NC} (peut nécessiter un test depuis le navigateur)"
fi

echo -e "\n${GREEN}🎉 Tests d'intégration terminés !${NC}"
echo -e "\n${YELLOW}Pour tester manuellement :${NC}"
echo "1. Ouvrez http://localhost:4200 dans votre navigateur"
echo "2. Connectez-vous avec alice@example.com / alice123"
echo "3. Naviguez dans l'application pour vérifier toutes les fonctionnalités"
