const Comment = require("../models/Comment")
const Post = require("../models/Post")

const GetComments = async (req, res) => {
  const postId = req.params.postId

  try {
    const comments = await Comment.find({ post: postId }).populate(
      "user",
      "username profilePic"
    )

    res.send(comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    res.status(500).send({ error: error.message })
  }
}

const CreateComment = async (req, res) => {
  if (!res.locals.payload || !res.locals.payload.id) {
    return res.status(401).send({ error: "Unauthorized: User ID not found." })
  }
  try {
    const { title, content } = req.body
    const postId = req.params.postId
    const userId = res.locals.payload.id
    let comment
    try {
      comment = await Comment.create({
        title,
        content,
        post: postId,
        user: userId,
      })
    } catch (creationError) {
      console.error("Error creating comment:", creationError)
      return res.status(500).send({ error: "Failed to create comment." })
    }

    await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } })

    const populatedComment = await Comment.findById(comment._id).populate(
      "user",
      "username profilePic"
    )

    res.send(populatedComment)
  } catch (error) {
    console.error("Error in CreateComment:", error)
    res.status(500).send({ error: error.message })
  }
}

const UpdateComment = async (req, res) => {
  try {
    const commentId = req.params.comment_id
    const updates = req.body

    const updatedComment = await Comment.findByIdAndUpdate(commentId, updates, {
      new: true,
      runValidators: true,
    })

    if (!updatedComment) {
      return res.send({ msg: "Comment not found" })
    }

    res.send(updatedComment)
  } catch (error) {
    res.send({ error: error.message })
  }
}

const DeleteComment = async (req, res) => {
  try {
    const commentId = req.params.comment_id
    const result = await Comment.deleteOne({ _id: commentId })

    if (result.deletedCount === 0) {
      return res.send({ msg: "Comment not found" })
    }

    await Post.updateMany(
      { comments: commentId },
      { $pull: { comments: commentId } }
    )

    res.send({
      msg: "Comment Deleted",
      payload: commentId,
      status: "Ok",
    })
  } catch (error) {
    res.send({ error: error.message })
  }
}

module.exports = {
  GetComments,
  CreateComment,
  UpdateComment,
  DeleteComment,
}
