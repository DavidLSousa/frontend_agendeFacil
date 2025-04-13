FROM node:18-slim

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

EXPOSE 4173

CMD ["npm", "run", "preview"]