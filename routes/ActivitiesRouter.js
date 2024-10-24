const express = require("express")
const router = express.Router()
const controller = require("../controllers/ActivitiesController")
const middleware = require("../middleware/index")

router.get("/", controller.GetActivities)
router.post(
  "/:postId",
  middleware.stripToken,
  middleware.verifyToken,
  upload.array("photos"),
  controller.CreateActivities
)
router.put(
  "/:activities_id",
  middleware.stripToken,
  middleware.verifyToken,
  upload.array("photos"),
  controller.UpdateActivities
)
router.delete(
  "/:activities_id",
  middleware.stripToken,
  middleware.verifyToken,
  controller.DeleteActivities
)

module.exports = router
