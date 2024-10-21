const express = require("express")
const router = express.Router()
const controller = require("../controllers/CommentController")
const middleware = require("../middleware/index")

router.get("/:postId", controller.GetComments)
router.post(
  "/:postId",
  middleware.stripToken,
  middleware.verifyToken,
  controller.CreateComment
)
router.put(
  "/:comment_id",
  middleware.stripToken,
  middleware.verifyToken,
  controller.UpdateComment
)
router.delete(
  "/:comment_id",
  middleware.stripToken,
  middleware.verifyToken,
  controller.DeleteComment
)

module.exports = router
