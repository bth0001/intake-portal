const mongoose = require("mongoose");

const actionItemSchema = new mongoose.Schema({
  actionItemNotes: {
    type: String
  },
  actionItemAttachments: {
    type: String
  }
       
}, {timestamps: {createdAt: 'created_at'}});


const ActionItem = mongoose.model("ActionItem", actionItemSchema);

module.exports = ActionItem;