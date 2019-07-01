const router = require('express').Router()

const readAllForTerm = require('../../handlers/weekplans/terms/read-all.js')
router.get('/terms/:TermId', readAllForTerm.authorizer, readAllForTerm.handler)

const setForTermSection = require('../../handlers/weekplans/set.js')
router.post('/', setForTermSection.authorizer, setForTermSection.handler)

module.exports = router
