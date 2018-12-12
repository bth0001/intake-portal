var mongoose = require("mongoose");

var submissionSchema = new mongoose.Schema(
  {
    itemType: String,
    status: String,
    name: String,
    date: String,
    email: String,
    businessUnit: String,
    languages: String,
    voiceTalent: String,
    useSelection: String,
    use: String,
    number: String,
    targetDate: String,
    description: String,
    attachment: [
      { 
        documentation: { 
          type:String,
          default: null
        } 
      }
    ],
    notes: String,
    actionItems: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ActionItem"
        },
        actionItemNotes: {
          type: String,
          default: null
        },
        actionItemAttachments: {
          type: String,
          default: null
        }
      }
    ],
    history: [
      {
        historyName: {
          type: String
        },
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ActionItem"
        },
        time: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: { createdAt: "created_at" } }
);

const Submissions = mongoose.model("Submissions", submissionSchema);

module.exports = Submissions;