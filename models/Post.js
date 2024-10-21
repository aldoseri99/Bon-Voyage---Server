const mongoose = require("mongoose");

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
      required: true,
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
      required: true,
    },
    environment: {
      type: String,
    },
    photos: {
      type: String,
    },
    likedBy: {
      type: [mongoose.Schema.Types.ObjectId],
       ref: "User",
       default: [],
    },
    like: {
      type: Number,
      default: 0,
    },
    
    User: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activities" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
