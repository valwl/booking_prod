FROM node:18



WORKDIR /booking_project



COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps



COPY . .



CMD ["npm", "start"]