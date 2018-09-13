var mongoose = require("mongoose");

var inquirySchema = new mongoose.Schema({
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
  description: String,
  attachment: String
});

const Inquiry = mongoose.model("Inquiry", inquirySchema);

module.exports = Inquiry;