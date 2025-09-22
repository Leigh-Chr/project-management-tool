# 🚀 Guide de Déploiement Railway - Étape par Étape

## ✅ Configuration Vérifiée

La configuration Railway est **PRÊTE** ! Tous les tests passent :
- ✅ Fichiers `railway.toml` configurés
- ✅ Compilation backend/frontend OK
- ✅ Variables d'environnement prêtes

## 📋 Étapes de Déploiement

### **ÉTAPE 1 : Créer le Projet Backend**

1. **Aller sur [Railway.app](https://railway.app)**
2. **Se connecter** avec GitHub
3. **Créer un nouveau projet** : "PMT-Backend"
4. **Connecter le repository** : `[VOTRE_REPO_GITHUB]`
5. **Configurer le Root Directory** : `backend`
6. **Ajouter MySQL** :
   - Cliquer sur "Add Service" → "Database" → "MySQL"
   - Railway génère automatiquement les variables

### **ÉTAPE 2 : Configurer le Backend**

#### Variables d'Environnement Backend :
```
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=${{MySQL.MYSQL_URL}}
SPRING_DATASOURCE_USERNAME=${{MySQL.MYSQL_USER}}
SPRING_DATASOURCE_PASSWORD=${{MySQL.MYSQL_PASSWORD}}
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
```

#### Générer une clé JWT :
```bash
# Générer une clé JWT sécurisée
openssl rand -base64 32
```

### **ÉTAPE 3 : Déployer le Backend**

1. **Déployer** le service backend
2. **Attendre** que le build soit terminé
3. **Noter l'URL** du backend (ex: `https://pmt-backend-production.up.railway.app`)

### **ÉTAPE 4 : Créer le Projet Frontend**

1. **Créer un nouveau projet** : "PMT-Frontend"
2. **Connecter le même repository** : `[VOTRE_REPO_GITHUB]`
3. **Configurer le Root Directory** : `frontend`

### **ÉTAPE 5 : Configurer le Frontend**

#### Variables d'Environnement Frontend :
```
NODE_ENV=production
API_URL=https://[URL_BACKEND_RAILWAY]/api
```

**Remplacez `[URL_BACKEND_RAILWAY]`** par l'URL réelle du backend.

### **ÉTAPE 6 : Déployer le Frontend**

1. **Déployer** le service frontend
2. **Attendre** que le build soit terminé
3. **Noter l'URL** du frontend (ex: `https://pmt-frontend-production.up.railway.app`)

## 🔧 Configuration Finale

### **Mettre à jour les URLs**

Une fois les deux services déployés :

1. **Backend** : Mettre à jour `ALLOWED_ORIGINS` avec l'URL du frontend
2. **Frontend** : Vérifier que `API_URL` pointe vers le backend

### **Variables d'Environnement Finales**

#### Backend :
```
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=${{MySQL.MYSQL_URL}}
SPRING_DATASOURCE_USERNAME=${{MySQL.MYSQL_USER}}
SPRING_DATASOURCE_PASSWORD=${{MySQL.MYSQL_PASSWORD}}
JWT_SECRET=your-generated-jwt-secret
ALLOWED_ORIGINS=https://pmt-frontend-production.up.railway.app
```

#### Frontend :
```
NODE_ENV=production
API_URL=https://pmt-backend-production.up.railway.app/api
```

## 🧪 Tests de Validation

### **1. Test Backend**
```bash
# Tester l'API backend
curl https://[BACKEND_URL]/api/health
```

### **2. Test Frontend**
- Ouvrir l'URL du frontend
- Se connecter avec : `alice@example.com` / `alice123`
- Vérifier que les données se chargent

### **3. Test d'Intégration**
- Créer un projet
- Ajouter des tâches
- Vérifier que tout fonctionne

## 🆘 Dépannage

### **Problèmes Courants**

1. **Build échoue** : Vérifier les logs Railway
2. **Base de données** : Vérifier les variables MySQL
3. **CORS** : Vérifier `ALLOWED_ORIGINS`
4. **JWT** : Vérifier la clé secrète

### **Logs Railway**
- **Backend** : Logs Spring Boot
- **Frontend** : Logs npm
- **Database** : Logs MySQL

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifier les logs Railway
2. Tester la configuration locale : `./test-railway-config.sh`
3. Consulter la documentation : `docs/deployment.md`

---

**🎉 Une fois terminé, votre application sera accessible sur Railway !**
