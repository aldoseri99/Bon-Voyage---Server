const express = require('express')
const router = require('express').Router()
const controller = require('../controllers/PostController')

router.get('/', controller.GetPost)
router.post('/', upload.array('photos'), controller.CreatePost)
router.put('/:post_id', upload.array('photos'), controller.UpdatePost)
router.delete('/:post_id', controller.DeletePost)
router.get('/details/:post_id', controller.PostDetail)

module.exports = router
