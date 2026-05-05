const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const connectDB = async () => {
  try {
    // If you add an Atlas URI later, it will use that. 
    // Otherwise, it creates a temporary local database so your app works immediately!
    if (process.env.MONGO_URI && !process.env.MONGO_URI.includes("127.0.0.1")) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB Connected (Cloud/Atlas)");
    } else {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      await mongoose.connect(mongoUri);
      console.log("MongoDB Connected (In-Memory Database for Development) ✅");
    }
  } catch (error) {
    console.error("MongoDB Connection Failed", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;