const router = require('express').Router()

const get = require('../../handlers/kv/get.js')
router.get('/:key', get.authorizer, get.handler)

const set = require('../../handlers/kv/set.js')
router.put('/:key', set.authorizer, set.handler)

module.exports = router
