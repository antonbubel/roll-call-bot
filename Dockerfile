FROM node:12
WORKDIR /app

# Copy package.json and package.lock.json files and run npm install
COPY package*.json ./
RUN npm install
RUN npm ci --only=production

# Copy the rest of the files
COPY index.js ./
COPY src/. ./src/.

# run start script
CMD [ "npm", "run", "start" ]
