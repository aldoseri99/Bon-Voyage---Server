const mongoose = require("mongoose")

const activitiesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    rate: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    photos: {
      type: [String],
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
)

const Activities = mongoose.model("Activities", activitiesSchema)

module.exports = Activities
