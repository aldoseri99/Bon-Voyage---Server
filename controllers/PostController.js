const Post = require('../models/Post')
const multer = require('multer')
const path = require('path')
const User = require('../models/User')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploadPost/')
  },
  filename: (req, file, cb) => {
    __filename = 'test'
    cb(null, Date.now() + file.originalname)
  }
})

// Initialize multer
upload = multer({ storage: storage })

const GetPost = async (req, res) => {
  try {
    const post = await Post.find({})
      .populate('activities')
      .populate('User')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username profilePic'
        }
      })
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
      like
    } = req.body

    const userId = res.locals.payload.id

    const photos = req.file ? req.file.filename : null

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
      User: userId
    })

    res.send(post)
  } catch (error) {
    console.error('Error creating post:', error) // Log error details
    res.status(500).send({ error: error.message }) // Send error response
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
      runValidators: true
    })

    if (!updatedPost) {
      return res.send({ msg: 'Post not found' })
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
      msg: 'Post Deleted',
      payload: req.params.post_id,
      status: 'Ok'
    })
  } catch (error) {
    throw error
  }
}

const PostDetail = async (req, res) => {
  try {
    const post = await Post.find({ _id: req.params.post_id })
      .populate('activities')
      .populate('comments')
    res.send(post)
  } catch (error) {
    throw error
  }
}

const LikePost = async (req, res) => {
  const postId = req.params.id
  const userId = req.body.userId

  try {
    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).send({ message: 'Post not found' })
    }

    const userIndex = post.likedBy.indexOf(userId)

    if (userIndex === -1) {
      post.likedBy.push(userId)
      post.like += 1
    } else {
      post.likedBy.splice(userIndex, 1)
      post.like -= 1
    }

    const updatedPost = await post.save()

    res.send(updatedPost)
  } catch (error) {
    console.error('Error updating like count:', error)
    res.status(500).send({ error: error.message })
  }
}

const GetPostsByUser = async (req, res) => {
  try {
    const userId = req.params.user_id
    const posts = await Post.find({ User: userId })
      .populate('activities')
      .populate('comments')
    res.send(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    res.send({ error: error.message })
  }
}

const GetPostByFollow = async (req, res) => {
  try {
    const followings = req.params.user_following.split(',')

    const posts = await Post.find({ User: { $in: followings } })
      .populate('activities')
      .populate('comments')
      .populate('User')

    res.send(posts)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
}

const ToggleBookmark = async (req, res) => {
  try {
    const { userId, postId } = req.params
    const user = await User.findById(userId)
    if (!user) {
      return res.send({ message: 'no user' })
    }

    const post = await Post.findById(postId)
    if (!post) {
      return res.send({ message: 'no post' })
    }
    const isBookmarked = user.bookmarks.includes(postId)
    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter(
        (bookmark) => bookmark.toString() !== postId
      )
      await user.save()

      return res.send({ message: 'Post Already Bookmarked' })
    } else {
      user.bookmarks.push(postId)
      await user.save()
      return res.send({ message: 'Bookmark Successfully' })
    }
  } catch (error) {
    res.send({ message: 'Error sadly' })
  }
}

const GetBookmarkedPost = async (req, res) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId).populate('bookmarks')
    if (!user) {
      return res.send({ message: 'no user' })
    }
    console.log(user.bookmarks)

    return res.send({ bookmarks: user.bookmarks })
  } catch (error) {}
}

module.exports = {
  GetPost,
  CreatePost,
  UpdatePost,
  DeletePost,
  PostDetail,
  LikePost,
  GetPostsByUser,
  GetPostByFollow,
  ToggleBookmark,
  GetBookmarkedPost
}
