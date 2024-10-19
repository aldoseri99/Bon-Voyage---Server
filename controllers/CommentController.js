const Comment = require("../models/Comment")

const GetComments = async (req, res) => {
  try {
    const { postId } = req.params
    const comments = await Comment.find({ post: postId }).populate("user")
    res.send(comments)
  } catch (error) {
    res.send({ error: error.message })
  }
}

const CreateComment = async (req, res) => {
  try {
    const { title, content, post, user } = req.body

    const comment = await Comment.create({
      title,
      content,
      post,
      user,
    })

    res.send(comment)
  } catch (error) {
    res.send({ error: error.message })
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
