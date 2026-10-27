FROM node:18-slim
WORKDIR /app
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*
COPY package.json .
RUN npm install
COPY server.js .
EXPOSE 4000
CMD ["node", "server.js"]
