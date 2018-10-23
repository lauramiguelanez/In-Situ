const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const spaceSchema = new Schema(
  {
    creator: String,
    image: String,
    location: {},
    isPrivate: Boolean,
    media: [],
    likes: Number,
    usersWhoLiked: []
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

spaceSchema.index({ location: "2dsphere" });

const Space = mongoose.model("Space", spaceSchema);
module.exports = Space;
