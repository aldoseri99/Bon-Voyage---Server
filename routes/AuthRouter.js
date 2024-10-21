const router = require('express').Router()
const controller = require('../controllers/AuthController')
const middleware = require('../middleware')

router.get('/users/:user_id', controller.GetAllUsers)
router.put('/user/:user_id', controller.GetUserInfo)
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
router.put('/edit/:user_id', upload.single('profilePic'), controller.UpdateUser)
module.exports = router
