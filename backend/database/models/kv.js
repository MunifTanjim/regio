'use strict'

module.exports = (sequelize, DataTypes) => {
  const KV = sequelize.define(
    'KV',
    {
      key: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING
      },
      value: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.STRING
      }
    },
    { createdAt: 'created', updatedAt: 'updated' }
  )

  KV.associate = () => {}

  return KV
}
