const express = require("express")
const router = express.Router()
const controller = require("../controllers/ActivitiesController")

router.get("/", controller.GetActivities)
router.post("/:postId", upload.array("photos"), controller.CreateActivities)
router.put(
  "/:activities_id",
  upload.array("photos"),
  controller.UpdateActivities
)
router.delete("/:activities_id", controller.DeleteActivities)

module.exports = router
