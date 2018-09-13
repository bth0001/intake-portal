var mongoose = require("mongoose");

var requestSchema = new mongoose.Schema({
  name: String,
  date: String,
  email: String,
  businessUnit: String,
  languages: String,
  pastClient: String,
  voiceTalent: String,
  use: String,
  baseElements: String,
  number: String,
  description: String
});

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;