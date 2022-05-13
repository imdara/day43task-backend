import mongoose from "mongoose";

const serSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  secretCode: String,
});

export default mongoose.model("User", serSchema);
