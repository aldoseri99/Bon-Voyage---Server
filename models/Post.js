const mongoose = require("mongoose")

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    review: {
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
    weather: {
      type: String,
      enum: ["Sunny", "Cloudy", "Rainy", "Snowy", "Windy"],
      
    },
    temperature: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    country: {
      type: String,
    },
    environment: {
      type: String,
      enum: ["City", "Nature", "Beach", "Mountain", "Desert"],
    },
    photos: {
      type: [String]
    },
    like: {
      type: Number,
      default: 0,
    },
    activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activities" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
)

const Post = mongoose.model("Post", postSchema)

module.exports = Post
