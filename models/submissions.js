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
        actionItemNotes: {
          type: String,
          default: null
        },
        actionItemAttachments: {
          type: String,
          default: null
        }
      }
    ]
  },
  { timestamps: { createdAt: "created_at" } }
);

const Submissions = mongoose.model("Submissions", submissionSchema);

module.exports = Submissions;