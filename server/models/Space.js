const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const spaceSchema = new Schema(
  {
    creator: String,
    image: String,
    location: { type: { type: String }, coordinates: [Number] },
    isPrivate: Boolean,
    data: []
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Space = mongoose.model("Space", spaceSchema);
module.exports = Space;
