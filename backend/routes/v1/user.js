const router = require('express').Router()

const read = require('../../handlers/user/read.js')
router.get('/', read.authorizer, read.handler)

const updatePassword = require('../../handlers/user/update-password.js')
router.post('/password', updatePassword.authorizer, updatePassword.handler)

module.exports = router
