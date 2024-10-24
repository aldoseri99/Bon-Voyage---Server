const express = require('express')
const cors = require('cors')
const path = require('path')

const PORT = process.env.PORT || 3000

const db = require('./db')
const app = express()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')))

const AuthRouter = require('./routes/AuthRouter')
app.use('/auth', AuthRouter)

const PostRouter = require('./routes/PostRouter')
app.use('/Posts', PostRouter)

const ActivitiesRouter = require('./routes/ActivitiesRouter')
app.use('/activities', ActivitiesRouter)

const CommentRouter = require('./routes/CommentRouter')
app.use('/comment', CommentRouter)

const LocationRouter = require('./routes/LocationRouter')
app.use('/location', LocationRouter)

app.use('/', (req, res) => {
  res.send(`Connected!`)
})

app.listen(PORT, () => {
  console.log(`Running Express server on Port ${PORT} . . .`)
})
