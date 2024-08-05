# Dockerfile

# Usa una imagen oficial de Node.js como base
FROM node:18

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia el package.json y el package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Expone el puerto de la aplicación
EXPOSE 4002

# Define el comando para iniciar la aplicación
CMD ["node", "index.js"]
