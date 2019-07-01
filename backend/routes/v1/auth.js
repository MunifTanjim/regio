const router = require('express').Router()

const login = require('../../handlers/auth/login.js')
router.post('/login', login.handler)

const logout = require('../../handlers/auth/logout.js')
router.post('/logout', logout.handler)

module.exports = router
