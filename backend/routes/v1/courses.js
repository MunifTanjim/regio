const router = require('express').Router()

const list = require('../../handlers/courses/list.js')
router.get('/', list.authorizer, list.handler)

const create = require('../../handlers/courses/create.js')
router.post('/', create.authorizer, create.handler)

const read = require('../../handlers/courses/read.js')
router.get('/:CourseId', read.authorizer, read.handler)

const delete_ = require('../../handlers/courses/delete.js')
router.delete('/:CourseId', delete_.authorizer, delete_.handler)

module.exports = router
