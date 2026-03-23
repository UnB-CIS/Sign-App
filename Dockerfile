FROM node:20

RUN apt-get update && apt-get install -y watchman && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

# Expõe a porta do Metro Bundler
EXPOSE 8081

CMD ["node", "node_modules/.bin/react-native", "start", "--host", "0.0.0.0"]
