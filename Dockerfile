FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci || npm install

COPY . .

RUN npm run build || echo "No build script found"

EXPOSE 3000

CMD ["npm", "run", "serve"]