const User = require('../models/User')
const middleware = require('../middleware')

const Register = async (req, res) => {
  try {
    // Extracts the necessary fields from the request body
    const { email, password, name, username, profilePic } = req.body
    // Hashes the provided password
    let passwordDigest = await middleware.hashPassword(password)
    // Checks if there has already been a user registered with that email
    let existingUser = await User.findOne({ email })
    let existingUsername = await User.findOne({ username })
    if (existingUser) {
      return res
        .status(400)
        .send('A user with that email has already been registered!')
    } else if (existingUsername) {
      return res
        .status(400)
        .send('A user with that username has already been registered!')
    } else {
      // Creates a new user
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
        followings: user.followings
      }
      let token = middleware.createToken(payload)

      return res.send({
        user: payload,
        token
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
        email: user.email
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
    const { name, phone } = req.body
    let user = await User.findByIdAndUpdate(req.params.user_id, {
      name: name,
      phone: phone
    })

    let payload = {
      id: user._id,
      username: user.username,
      name: user.name,
      email: user.email
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

const follow = async (req, res) => {
  try {
    let user = await User.findByIdAndUpdate(req.params.user_id, {
      followings: req.body
    })
    let payload = {
      id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      followings: user.followings
    }

    return res.send({ status: 'User Followed!', user: payload })
  } catch (error) {}
}

const unfollow = async (req, res) => {}

const getAllUsers = async (req, res) => {
  let users = await User.find()
  res.send({ users })
}

module.exports = {
  Register,
  Login,
  UpdatePassword,
  UpdateUser,
  CheckSession,
  follow,
  getAllUsers
}
