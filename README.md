## How to Run This Docker-Based Node.js + MongoDB App

This guide will walk you through setting up and running the full project using Docker and Docker Compose.

---

### Prerequisites

Before starting, make sure you have the following installed:

- **Git**
- **Docker** and **Docker Compose**
- An internet connection

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/Cyber-Naimo/my-bank.git
cd my-bank

```

---

### Step 2: Set Up the Docker Environment

Create a `docker-compose.yml` file in the root of the project with the following content:

```yaml
version: "3.8"

services:
  mongo:
    container_name: mongo
    image: mongo
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: qwerty
    volumes:
      - hostpath:/data/db

  mongo-express:
    image: mongo-express
    ports:
      - "8081:8081"
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: admin
      ME_CONFIG_MONGODB_ADMINPASSWORD: qwerty
      ME_CONFIG_MONGODB_URL: mongodb://admin:qwerty@mongo:27017/
  testapp:
    container_name: testapp
    image: naimss0/testapp:1.2
    ports:
      - "5050:5050"
    environment:
      - MONGO_URL=mongodb://admin:qwerty@mongo:27017
    depends_on:
      - mongo

```

---

### Step 3: Run MongoDB and Mongo Express

Run the following command to start both containers:

```bash
docker compose -f ./docker-compose.yml up -d

```

This will:

- Start **MongoDB** on port `27017`
- Start **Mongo Express** on port `8081`

---

### Step 4: Access MongoDB Dashboard (Mongo Express)

Go to your browser and open:

```
http://localhost:8081

```

The **Mongo Express dashboard** will appear.

**Note:** On your first visit, you'll be asked to log in with default credentials:

- **Username:** `admin`
- **Password:** `pass`

**Once logged in, create the following:**

1. **Database Name:** `mybank`
2. **Collection Name:** `users`

> This database will be used by your application to store user data.
> 

---

### Step 5: Build and Run Your Application

Create a new file named `Dockerfile` in the project root and paste the following:

```docker
FROM node:18-alpine

WORKDIR /app

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=qwerty

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5050

CMD ["node", "server.js"]

```

Then build your Docker image:

```bash
docker build -t your_dockerhub_username/testapp:1.0 .

```

Log in to Docker Hub:

```bash
docker login -u your_dockerhub_username

```

Then push the image:

```bash
docker push your_dockerhub_username/testapp:1.0

```

---

### Step 6: Run the Node.js App

Now run your app using:

```bash
docker run -p 5050:5050 your_dockerhub_username/testapp:1.0

```

This will expose your application on:

```
http://localhost:5050

```

### App Login Credentials

- **Username:** `admin`
- **Password:** `pass`

---

### Useful Docker Commands

**Check running containers:**

```bash
docker ps

```

**List all Docker images:**

```bash
docker images

```

**Stop and remove containers:**

```bash
docker compose -f ./docker-compose.yml down

```

---

### Summary

| Service | Port | Default Credentials |
| --- | --- | --- |
| MongoDB | 27017 | admin / qwerty |
| Mongo Express UI | 8081 | admin / qwerty |
| Node.js App | 5050 | admin / pass |
