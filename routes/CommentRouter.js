const express = require("express")
const router = express.Router()
const controller = require("../controllers/CommentController")

router.get("/:postId", controller.GetComments)
router.post("/:postId", controller.CreateComment)
router.put("/:comment_id", controller.UpdateComment)
router.delete("/:comment_id", controller.DeleteComment)

module.exports = router
