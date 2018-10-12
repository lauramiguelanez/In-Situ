const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const catalogSchema = new Schema(
  {
    userId: String,
    scopes: []
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Catalog = mongoose.model("Catalog", catalogSchema);
module.exports = Catalog;