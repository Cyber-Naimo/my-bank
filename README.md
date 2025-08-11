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
  # MongoDB service
  mongo:
    container_name: mongo
    image: mongo
    ports:
      - "27017:27017"  # Expose MongoDB port
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: qwerty
    volumes:
      - hostpath:/data/db  # Persist database data

  # Web UI for MongoDB
  mongo-express:
    image: mongo-express
    ports:
      - "8081:8081"  # Access UI at localhost:8081
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: admin
      ME_CONFIG_MONGODB_ADMINPASSWORD: qwerty
      ME_CONFIG_MONGODB_URL: mongodb://admin:qwerty@mongo:27017/

  # Your Node.js app
  testapp:
    container_name: testapp
    image: naimss0/testapp:1.2
    ports:
      - "5050:5050"  # Expose app port
    environment:
      - MONGO_URL=mongodb://admin:qwerty@mongo:27017
    depends_on:
      - mongo  # Start MongoDB first


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
# Use a lightweight version of Node.js 18 as the base image
FROM node:18-alpine

# Set the working directory inside the container to /app
WORKDIR /app

# Define environment variables (you can access them in your code using process.env)
ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=qwerty

# Copy package.json and package-lock.json (if it exists) to the working directory
COPY package*.json ./

# Install dependencies defined in package.json
RUN npm install

# Copy all remaining files from the host to the container
COPY . .

# Expose port 5050 so it can be accessed from outside the container
EXPOSE 5050

# Command to run the application when the container starts
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

Here’s your GitHub README section for **Step 7: Monitoring and Logging** formatted clearly:

---

## Step 7: Monitoring and Logging

### **1. Download and Setup Prometheus**

1. [Download Prometheus for Windows](https://prometheus.io/download/).
2. Extract the downloaded ZIP file.
3. Copy the extracted **Prometheus** folder into `C:\`.

---

### **2. Configure Prometheus**

1. Navigate to the **Prometheus** folder.
2. Open the `prometheus.yml` file in a text editor.
3. Add the following configuration under `scrape_configs`:

```yaml
scrape_configs:
  - job_name: "nodejs_app"
    static_configs:
      - targets: ["localhost:5050"]
        labels:
          app: "nodejs"
```

4. Save the file.

---

### **3. Run Prometheus**

* Open Command Prompt in the **Prometheus** folder.
* Run:

```bash
prometheus.exe
```

---

### **4. Verify Prometheus Targets**

* Go to: [http://localhost:9090/targets](http://localhost:9090/targets)
  Check if the connection between Prometheus and your Node.js app is established.

---

### **5. Check Node.js App Metrics**

* Visit: [http://localhost:5050/metrics](http://localhost:5050/metrics)
  You should see your app's metrics.

---

### **6. Access Grafana Dashboard**

* Open: [http://localhost:3000/](http://localhost:3000/)
  Use Grafana to visualize the metrics collected by Prometheus.






### Summary

| Service | Port | Default Credentials |
| --- | --- | --- |
| MongoDB | 27017 | admin / qwerty |
| Mongo Express UI | 8081 | admin / pass |
| Node.js App | 5050 |  |
