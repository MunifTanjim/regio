const router = require('express').Router()

const readAll = require('../../handlers/countries/read-all.js')
router.get('/', readAll.authorizer, readAll.handler)

const read = require('../../handlers/countries/read.js')
router.get('/:CountryId', read.authorizer, read.handler)

module.exports = router
