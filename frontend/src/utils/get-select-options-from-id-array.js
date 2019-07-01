const getSelectOptionsFromIdArray = (ids = []) => {
  return ids.reduce((opts, id) => {
    opts[id] = id
    return opts
  }, {})
}

export default getSelectOptionsFromIdArray
