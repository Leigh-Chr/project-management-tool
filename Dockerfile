# Build stage
FROM node:20-alpine AS build
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build -- --configuration production

# Production stage
FROM nginx:alpine

# Copy built assets and nginx config
COPY --from=build /usr/src/app/dist/project-management-tool/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
