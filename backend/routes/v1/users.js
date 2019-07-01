const router = require('express').Router()

const register = require('../../handlers/users/register.js')
router.post('/register', register.handler)

const delete_ = require('../../handlers/users/delete.js')
router.delete('/:UserId', delete_.authorizer, delete_.handler)

const resetPassword = require('../../handlers/users/action/reset-password.js')
router.post(
  '/:UserId/action/reset-password',
  resetPassword.authorizer,
  resetPassword.handler
)

const createContactInfo = require('../../handlers/users/contactinfos/create.js')
router.post(
  '/:UserId/contactinfos',
  createContactInfo.authorizer,
  createContactInfo.handler
)

const updateContactInfo = require('../../handlers/users/contactinfos/update.js')
router.post(
  '/:UserId/contactinfos/:ContactInfoId',
  updateContactInfo.authorizer,
  updateContactInfo.handler
)

const deleteContactInfo = require('../../handlers/users/contactinfos/delete.js')
router.delete(
  '/:UserId/contactinfos/:ContactInfoId',
  deleteContactInfo.authorizer,
  deleteContactInfo.handler
)

module.exports = router
