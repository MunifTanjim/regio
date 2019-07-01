import { get, intersection, keys, map } from 'lodash-es'
import { memo } from 'react'
import { connect } from 'react-redux'

function Permit({ children, userId, userRoles, UserId, ...roles }) {
  const allowedRoles = keys(roles)

  if (!allowedRoles.length && !UserId) return children

  if (userId === String(UserId)) return children

  const hasPermit = intersection(allowedRoles, userRoles).length

  return hasPermit ? children : null
}

const mapStateToProps = ({ user }) => ({
  userId: get(user.data, 'User.id'),
  userRoles: map(get(user.data, 'User.Roles', []), 'id')
})

export default connect(
  mapStateToProps,
  {} // without the empty {}, `dispatch` will be injected to props
)(memo(Permit))
