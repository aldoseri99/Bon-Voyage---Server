const Activities = require("../models/Activities")
const Post = require("../models/Post")
const multer = require("multer")
const path = require("path")

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/Activities/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

// Initialize multer
upload = multer({ storage: storage })

const GetActivities = async (req, res) => {
  try {
    const activities = await Activities.find({}).populate("post")
    res.send(activities)
  } catch (error) {
    res.send({ error: error.message })
  }
}

const CreateActivities = async (req, res) => {
  try {
    const { name, place, cost, rate } = req.body
    const photos = req.files ? req.files.map((file) => file.filename) : []
    const postId = req.params.postId

    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).send({ msg: "Post not found" })
    }

    if (post.User.toString() !== res.locals.payload.id) {
      return res
        .status(403)
        .send({ msg: "You are not authorized to add activities to this post" })
    }

    // Create the activity
    const activity = await Activities.create({
      name,
      place,
      cost,
      rate,
      photos,
      post: postId,
    })

    await Post.findByIdAndUpdate(postId, {
      $push: { activities: activity._id },
    })

    res.send(activity)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
}

const UpdateActivities = async (req, res) => {
  try {
    const activityId = req.params.activities_id
    const updates = req.body
    if (req.files) {
      updates.photos = req.files.map((file) => file.filename)
    }

    const updatedActivity = await Activities.findByIdAndUpdate(
      activityId,
      updates,
      {
        new: true,
        runValidators: true,
      }
    )

    if (!updatedActivity) {
      return res.status(404).send({ msg: "Activity not found" })
    }

    res.send(updatedActivity)
  } catch (error) {
    res.send({ error: error.message })
  }
}

const DeleteActivities = async (req, res) => {
  try {
    const activityId = req.params.activities_id
    const activity = await Activities.findById(activityId).populate("post")

    if (!activity) {
      return res.status(404).send({ msg: "Activity not found" })
    }

    // Get user ID from the token
    const userId = res.locals.payload.id

    if (activity.post.User.toString() !== userId.toString()) {
      return res
        .status(403)
        .send({ msg: "Not authorized to delete this activity" })
    }

    const result = await Activities.deleteOne({ _id: activityId })
    if (result.deletedCount === 0) {
      return res.send({ msg: "Activity not found" })
    }

    await Post.updateMany(
      { activities: activityId },
      { $pull: { activities: activityId } }
    )

    res.send({
      msg: "Activity Deleted",
      payload: activityId,
      status: "Ok",
    })
  } catch (error) {
    console.error("Error deleting activity:", error)
    res.status(500).send({ error: error.message })
  }
}

module.exports = {
  GetActivities,
  CreateActivities,
  UpdateActivities,
  DeleteActivities,
}
