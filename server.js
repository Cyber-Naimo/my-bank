const express = require("express");
const app = express();
const path = require("path");
const MongoClient = require("mongodb").MongoClient;
// const client = new MongoClient("mongodb://admin:qwerty@localhost:27017");

const mongoUrl = process.env.MONGO_URL || "mongodb://admin:qwerty@mongo:27017";
const client = new MongoClient(mongoUrl);


const promClient = require("prom-client");

const PORT = 5050;
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// 🔸 Create a registry and collect default metrics
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

// 🔸 Custom Metrics
const requestCounter = new promClient.Counter({
    name: 'total_http_requests',
    help: 'Total number of HTTP requests'
});
register.registerMetric(requestCounter);

const userInsertCounter = new promClient.Counter({
    name: 'user_inserts_total',
    help: 'Number of users inserted into DB'
});
register.registerMetric(userInsertCounter);


let db;
client.connect()
    .then(() => {
        console.log("✅ Connected to MongoDB");
        db = client.db("mybank");
    })
    .catch(err => {
        console.error("❌ MongoDB connection error:", err);
    });


// 📥 GET all users
app.get("/getUsers", async (req, res) => {
    requestCounter.inc(); // Increment request counter
    await client.connect();
    console.log('Connected successfully to server');

    const db = client.db("mybank");
    const data = await db.collection('users').find({}).toArray();
    
    client.close();
    res.send(data);
});

// ➕ POST new user
app.post("/addUser", async (req, res) => {
    requestCounter.inc(); // Increment request counter
    const userObj = req.body;
    console.log(req.body);

    await client.connect();
    console.log('Connected successfully to server');

    const db = client.db("mybank");
    const result = await db.collection('users').insertOne(userObj);
    console.log(result);
    userInsertCounter.inc(); // Count insert
    console.log("data inserted in DB");
    client.close();
    res.send("User added successfully!");
});

// 📊 Expose /metrics endpoint for Prometheus to scrape
app.get("/metrics", async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
