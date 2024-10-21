const express = require('express')
const router = express.Router()
const controller = require('../controllers/PostController')
const middleware = require('../middleware/index')
const { LikePost } = require('../controllers/PostController')


router.get('/', controller.GetPost)

// Create a post (requires authentication)
router.post(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  upload.single('photos'),
  controller.CreatePost
)

// Update a post (requires authentication)
router.put(
  '/:post_id',
  middleware.stripToken,
  middleware.verifyToken,
  upload.single('photos'),
  controller.UpdatePost
)

// Delete a post (requires authentication)
router.delete(
  '/:post_id',
  middleware.stripToken,
  middleware.verifyToken,
  controller.DeletePost
)

// Get details of a specific post
router.get('/details/:post_id', controller.PostDetail)
router.patch('/like/:id', LikePost)

// Optional: Get all posts by a specific user (if needed)
router.get('/user/:user_id', controller.GetPostsByUser) // Ensure you have a controller function for this

router.get('/followed/:user_following', controller.GetPostByFollow)

module.exports = router
