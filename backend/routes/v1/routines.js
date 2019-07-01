const router = require('express').Router()

const readAllSlots = require('../../handlers/routines/slots/read-all.js')
router.get('/slots', readAllSlots.authorizer, readAllSlots.handler)

const readAllForTerm = require('../../handlers/routines/terms/read-all.js')
router.get('/terms/:TermId', readAllForTerm.authorizer, readAllForTerm.handler)

const setForTermSection = require('../../handlers/routines/set.js')
router.post('/', setForTermSection.authorizer, setForTermSection.handler)

module.exports = router
