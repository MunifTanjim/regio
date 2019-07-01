const directionMap = {
  '': 'ASC',
  '+': 'ASC',
  '-': 'DESC'
}

const parseSortQuery = (sortString, defaultSortString = '') => {
  if (!sortString) sortString = defaultSortString

  const sorts = sortString.split(',')

  return sorts.reduce((order, sort) => {
    let match = sort.match(/([+-]?)(.+)/)
    if (match) {
      let [, direction, field] = match
      order.push([field, directionMap[direction]])
    }
    return order
  }, [])
}

module.exports = parseSortQuery
