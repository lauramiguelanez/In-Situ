const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mediaSchema = new Schema(
  {
    spaceId: String,
    type: {
        type: String,
        enum : ["YOUTUBE", "IMAGE", "TEXT"],
        default: "IMAGE"
    },
    url: String
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Media = mongoose.model("Media", mediaSchema);
module.exports = Media;
