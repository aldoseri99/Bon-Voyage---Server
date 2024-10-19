const Post = require("../models/Post")
const multer = require("multer")
const path = require("path")

// Set up multer storage (as shown previously)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploadPost/")
  },
  filename: (req, file, cb) => {
    filename = "test"
    cb(null, Date.now() + file.originalname)
  },
})

// Initialize multer
upload = multer({ storage: storage })

const GetPost = async (req, res) => {
  try {
    const post = await Post.find({})
    res.send(post)
  } catch (error) {
    throw error
  }
}

const CreatePost = async (req, res) => {
  try {
    const {
      title,
      review,
      cost,
      rate,
      weather,
      temperature,
      date,
      country,
      environment,
      like,
    } = req.body

    const photos = req.files ? req.files.map((file) => file.filename) : []

    const post = await Post.create({
      title,
      review,
      cost,
      rate,
      weather,
      temperature,
      date,
      country,
      environment,
      like,
      photos,
    })
    res.send(post)
  } catch (error) {
    throw error
  }
}

const UpdatePost = async (req, res) => {
  try {
    const postId = req.params.post_id
    const updates = req.body
    if (req.files) {
      updates.photos = req.files.map((file) => file.filename)
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, updates, {
      new: true,
      runValidators: true,
    })

    if (!updatedPost) {
      return res.send({ msg: "Post not found" })
    }

    res.send(updatedPost)
  } catch (error) {
    res.send({ error: error.message })
  }
}

const DeletePost = async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.post_id })
    res.send({
      msg: "Post Deleted",
      payload: req.params.post_id,
      status: "Ok",
    })
  } catch (error) {
    throw error
  }
}

module.exports = {
  GetPost,
  CreatePost,
  UpdatePost,
  DeletePost,
}
