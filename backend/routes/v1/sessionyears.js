const router = require('express').Router()

const list = require('../../handlers/sessionyears/list.js')
router.get('/', list.authorizer, list.handler)

const create = require('../../handlers/sessionyears/create.js')
router.post('/', create.authorizer, create.handler)

const read = require('../../handlers/sessionyears/read.js')
router.get('/:id', read.authorizer, read.handler)

const delete_ = require('../../handlers/sessionyears/delete.js')
router.delete('/:id', delete_.authorizer, delete_.handler)

module.exports = router
