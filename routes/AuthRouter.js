const router = require('express').Router()
const controller = require('../controllers/AuthController')
const middleware = require('../middleware')

router.get('/users/:user_id', controller.GetAllUsers)
router.post('/login', controller.Login)
router.post('/register', upload.single('profilePic'), controller.Register)
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
router.put('/follow/:user_id', controller.Follow)
module.exports = router
