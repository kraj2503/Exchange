FROM node:23-slim

WORKDIR /app

# Copy package.json and package-lock.json
COPY ./ws/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY ./ws ./

RUN npm run build

CMD ["node", "dist/index.js"]
