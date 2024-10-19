const Activities = require("../models/Activities")
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
const upload = multer({ storage: storage })

const GetActivities = async (req, res) => {
  try {
    const activities = await Activities.find({}).populate("post")
    res.send(activities)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
}

const CreateActivities = async (req, res) => {
  console.log("CreateActivities called")
  try {
    const { name, place, cost, rate, post } = req.body
    const photos = req.files ? req.files.map((file) => file.filename) : []

    const activity = await Activities.create({
      name,
      place,
      cost,
      rate,
      photos,
      post,
    })

    await Post.findByIdAndUpdate(post, { $push: { activities: activity._id } })

    res.status(201).send(activity)
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
    res.status(500).send({ error: error.message })
  }
}

const DeleteActivities = async (req, res) => {
  try {
    const activityId = req.params.activities_id
    const result = await Activities.deleteOne({ _id: activityId })

    if (result.deletedCount === 0) {
      return res.status(404).send({ msg: "Activity not found" })
    }

    res.send({
      msg: "Activity Deleted",
      payload: activityId,
      status: "Ok",
    })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
}

module.exports = {
  GetActivities,
  CreateActivities,
  UpdateActivities,
  DeleteActivities,
}
