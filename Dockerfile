# Imagen base de Node.js
FROM node:20-alpine

# Carpeta de trabajo
WORKDIR /app

# Copia archivos de dependencias
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia todo el código
COPY . .

# Construye la app
RUN npm run build

# Puerto
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "start"]

