const getModel = require('./get-model.js')

const applyAssociationFilter = (ModelName, filter, associations) => {
  const Model = getModel(ModelName)

  Object.keys(Model.associations).forEach(model => {
    if (!filter[model]) return

    const index = associations.findIndex(o => o.association === Model[model])

    if (~index) {
      Object.assign(associations[index], {
        where: filter[model]
      })
    } else {
      associations.push({
        association: Model[model],
        where: filter[model]
      })
    }

    applyAssociationFilter(model, filter[model], associations[index].include)

    delete filter[model]
  })
}

module.exports = applyAssociationFilter
