const router = require('express').Router()
const controller = require('../controllers/AuthController')
const middleware = require('../middleware')

router.get('/users', controller.getAllUsers)
router.post('/login', controller.Login)
router.post('/register', controller.Register)
router.put(
  '/updatePass/:user_id',
  middleware.stripToken,
  middleware.verifyToken,
  controller.UpdatePassword
)
router.put(
  '/update/:user_id',
  middleware.stripToken,
  middleware.verifyToken,
  controller.UpdateUser
)
router.get(
  '/session',
  middleware.stripToken,
  middleware.verifyToken,
  controller.CheckSession
)
router.post('/follow/:user_id', controller.follow)
module.exports = router
