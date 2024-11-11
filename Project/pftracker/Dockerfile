FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ENV BACKEND_URL = http://backend:8088
EXPOSE 3000
CMD ["npm", "start"]

