import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  about: { type: String },
  tags: { type: [String] },
  score1: { type: Number, default: 0 },
  score2: { type: Number, default: 0 },

  score: { type: Number, default: 0 },
  badge: {
    type: String,
    enum: ["Newbie", "Pro", "Expert", "Master", "God"],
    default: "Newbie",
  },
  answersGiven: { type: Number, default: 0 },
  joinedOn: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
