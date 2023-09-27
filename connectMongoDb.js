import mongoose from "mongoose";
import 'dotenv/config'

const DB_URL =
  process.env.DATABASE_URI;
  // "mongodb://127.0.0.1:27017/stack-overflow";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
