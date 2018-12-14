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
    voiceTalent: { 
      type:String,
      default: null
    },
    useSelection: String,
    use: String,
    number: String,
    targetDate: String,
    description: String,
    attachment: [
      { 
        type:String,
        default: null
      } 
    ],
    notes: String,
    actionItems: [
      {
        actionItemNotes: {
          type: String,
          default: null
        },
        actionItemAttachments: [
          {
            type: String,
            default: null
          }
        ],
        actionItemCount: {
          type: Number,
          default: 0
        },
      }
    ]
  },
  { timestamps: { createdAt: "created_at" } }
);

const Submissions = mongoose.model("Submissions", submissionSchema);

module.exports = Submissions;