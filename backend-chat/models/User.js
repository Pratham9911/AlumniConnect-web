const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  name: String,
  email: String,
  profileImage: String,
  connections: [String]  // list of firebaseUid of connections
});

module.exports = mongoose.model("User", userSchema);
