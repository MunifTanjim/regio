const asyncHandler = require('express-async-handler')
const get = require('lodash/get')

const RegioError = require('../../libs/error/regio-error.js')

module.exports = (AllowedRoleIds = []) =>
  asyncHandler(async (req, res, next) => {
    if (AllowedRoleIds.includes(null)) {
      return next()
    }

    if (!get(req.session, 'user')) {
      throw new RegioError(401, 'not authenticated')
    }

    const RoleIds = get(req.session, 'user.Roles', [])

    if (AllowedRoleIds.includes(true)) {
      req.grants = RoleIds
      return next()
    }

    const grants = RoleIds.reduce((grants, RoleId) => {
      if (AllowedRoleIds.includes(RoleId)) grants.push(RoleId)
      return grants
    }, [])

    if (!grants.length) {
      throw new RegioError(403, 'not authorized')
    }

    req.grants = grants

    return next()
  })
