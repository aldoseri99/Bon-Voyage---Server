const mongoose = require("mongoose")

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      
    },
    review: {
      type: String,
      
    },
    cost: {
      type: Number,
      
    },
    rate: {
      type: Number,
      min: 1,
      max: 5,
      
    },
    weather: {
      type: String,
  
      
    },
    temperature: {
      type: Number,
      
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
     
    },
    photos: {
      type: String
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
