# Multi-stage build pour optimiser la taille de l'image
FROM node:20-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration npm
COPY package*.json ./

# Installer les dépendances (incluant devDependencies pour Angular CLI)
RUN npm ci

# Copier le code source
COPY . .

# Construire l'application Angular
RUN npm run build

# Image de production avec nginx
FROM nginx:alpine

# Copier les fichiers buildés depuis l'étape précédente
COPY --from=build /app/dist/project-management-tool/browser /usr/share/nginx/html

# Copier la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/nginx.conf

# Exposer le port 80
EXPOSE 80

# Variables d'environnement
ENV API_URL=http://localhost:8080/api

# Commande de démarrage
CMD ["nginx", "-g", "daemon off;"]