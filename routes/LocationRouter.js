const express = require("express")
const router = express.Router()
const { getLocation } = require("../controllers/LocationController")

router.get("/:country", getLocation)

module.exports = router
