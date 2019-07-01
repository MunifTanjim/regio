const getModelPrimaryKeyField = Model => {
  const modelName = Model.options.name.singular

  return Model.primaryKeyAttributes.length > 1
    ? Model.primaryKeyAttributes
    : Model.primaryKeyAttributes[0] || `${modelName}Id`
}

module.exports = getModelPrimaryKeyField
