const User = require('../models/User')
const middleware = require('../middleware')
const Post = require('../models/Post')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/profilePics/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname)
  }
})

// Initialize multer
upload = multer({ storage: storage })

const Register = async (req, res) => {
  try {
    // Extracts the necessary fields from the request body
    const { email, password, name, username } = req.body
    const profilePic = req.file ? req.file.filename : null

    // Hashes the provided password
    let passwordDigest = await middleware.hashPassword(password)
    // Checks if there has already been a user registered with that email
    let existingUser = await User.findOne({ email })
    let existingUsername = await User.findOne({ username })
    if (existingUser) {
      return res.send({
        message: 'A user with that email has already been registered!'
      })
    } else if (existingUsername) {
      return res.send({
        message: 'A user with that username has already been registered!'
      })
    } else {
      const user = await User.create({
        name,
        email,
        passwordDigest,
        username,
        profilePic
      })
      // Sends the user as a response
      res.send(user)
    }
  } catch (error) {
    throw error
  }
}

const Login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({
      $or: [{ email: email }, { username: email }]
    })

    if (!user) {
      return res.send({
        message: 'No user with that email or username was found!'
      })
    }
    let matched = await middleware.comparePassword(
      user.passwordDigest,
      password
    )
    if (matched) {
      let payload = {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        followings: user.followings,
        profilePic: user.profilePic
      }
      let token = middleware.createToken(payload)

      return res.send({
        user: payload,
        token
      })
    } else {
      return res.send({
        message: 'Incorrect password!'
      })
    }
  } catch (error) {
    console.log(error)
    res.status(401).send({ status: 'Error', msg: 'An error has occurred!' })
  }
}

const UpdatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body
    let user = await User.findById(req.params.user_id)
    let matched = await middleware.comparePassword(
      user.passwordDigest,
      oldPassword
    )
    if (matched) {
      let passwordDigest = await middleware.hashPassword(newPassword)
      user = await User.findByIdAndUpdate(req.params.user_id, {
        passwordDigest
      })
      let payload = {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        followings: user.followings,
        profilePic: user.profilePic
      }
      return res.send({ status: 'Password Updated!', user: payload })
    }
    res
      .status(401)
      .send({ status: 'Error', msg: 'Old Password did not match!' })
  } catch (error) {
    console.log(error)
    res.status(401).send({
      status: 'Error',
      msg: 'An error has occurred updating password!'
    })
  }
}
const UpdateUser = async (req, res) => {
  try {
    const { name, username } = req.body
    const profilePic = req.file ? req.file.filename : null
    console.log(profilePic)

    let user
    if (name) {
      user = await User.findByIdAndUpdate(req.params.user_id, { name })
    }
    if (username) {
      let existingUsername = await User.findOne({ username })
      if (existingUsername) {
        return res.send({
          message: 'This username has already been taken!'
        })
      } else {
        user = await User.findByIdAndUpdate(req.params.user_id, { username })
      }
    }
    if (profilePic) {
      user = await User.findByIdAndUpdate(req.params.user_id, { profilePic })
    }

    let payload = {
      id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      followings: user.followings,
      profilePic: user.profilePic
    }
    return res.send({ status: 'User Updated!', user: payload })
  } catch (error) {
    console.log(error)
    res.status(401).send({
      status: 'Error',
      msg: 'An error has occurred updating password!'
    })
  }
}

const CheckSession = async (req, res) => {
  const { payload } = res.locals
  res.send(payload)
}

const Follow = async (req, res) => {
  try {
    let user = await User.findByIdAndUpdate(req.params.user_id, {
      followings: req.body
    })
    let payload = {
      id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      followings: user.followings,
      profilePic: user.profilePic
    }

    return res.send({ status: 'User Followed!', user: payload })
  } catch (error) {}
}

const GetAllUsers = async (req, res) => {
  let users = await User.find({ _id: { $ne: req.params.user_id } })
  res.send({ users })
}

const GetUserInfo = async (req, res) => {
  try {
    let user = await User.find({ _id: req.params.user_id })
    res.send({ user })
  } catch (error) {
    throw error
  }
}

module.exports = {
  Register,
  Login,
  UpdatePassword,
  UpdateUser,
  CheckSession,
  Follow,
  GetAllUsers,
  GetUserInfo
}
