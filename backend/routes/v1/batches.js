const router = require('express').Router()

const list = require('../../handlers/batches/list.js')
router.get('/', list.authorizer, list.handler)

const create = require('../../handlers/batches/create.js')
router.post('/', create.authorizer, create.handler)

const read = require('../../handlers/batches/read.js')
router.get('/:BatchId', read.authorizer, read.handler)

const update = require('../../handlers/batches/update.js')
router.patch('/:BatchId', update.authorizer, update.handler)

const delete_ = require('../../handlers/batches/delete.js')
router.delete('/:BatchId', delete_.authorizer, delete_.handler)

module.exports = router
