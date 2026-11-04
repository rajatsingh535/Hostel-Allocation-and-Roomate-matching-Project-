require("dotenv").config();
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let memoryServer = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const defaultUri =
    process.env.MONGODB_URI ||
    "mongodb+srv://pmm1006y_db_user:mWaoUBNVbfW5JK0Y@cluster0.19rnpsb.mongodb.net/hostel_db?retryWrites=true&w=majority";

  try {
    console.log(`[Database] Attempting connection to MongoDB Cluster...`);
    await mongoose.connect(defaultUri, { serverSelectionTimeoutMS: 15000 });
    console.log(`[Database] Successfully connected to MongoDB Cluster: ${mongoose.connection.host}/${mongoose.connection.name}`);
    return mongoose.connection;
  } catch (err) {
    console.warn(`[Database] MongoDB Cluster connection failed (${err.message}). Trying local MongoDB...`);
  }

  try {
    const localUri = "mongodb://127.0.0.1:27017/hostel_db";
    await mongoose.connect(localUri, { serverSelectionTimeoutMS: 3000 });
    console.log(`[Database] Connected to local MongoDB at ${localUri}`);
    return mongoose.connection;
  } catch (err) {
    console.warn(`[Database] Local MongoDB failed (${err.message}). Falling back to in-memory instance...`);
  }

  try {
    console.log(`[Database] Initializing in-memory MongoDB server...`);
    memoryServer = await MongoMemoryServer.create({ spawn: { timeout: 120000 } });
    const memUri = memoryServer.getUri();
    await mongoose.connect(memUri);
    console.log(`[Database] Connected to in-memory MongoDB at: ${memUri}`);
    return mongoose.connection;
  } catch (err) {
    console.error(`[Database] Fatal: Failed to initialize in-memory database:`, err);
    throw err;
  }
}

async function closeDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (memoryServer) {
    await memoryServer.stop();
  }
}

module.exports = { connectDB, closeDB };
