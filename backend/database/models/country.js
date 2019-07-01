'use strict'

module.exports = (sequelize, DataTypes) => {
  const Country = sequelize.define(
    'Country',
    {
      CountryId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.SMALLINT
      },
      code: {
        allowNull: false,
        type: DataTypes.STRING(2)
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      callingCodes: {
        allowNull: false,
        type: DataTypes.ARRAY(DataTypes.SMALLINT)
      }
    },
    { createdAt: 'created', updatedAt: 'updated' }
  )

  Country.associate = ({ Address }) => {
    Country.Addresses = Country.hasMany(Address, { foreignKey: 'CountryId' })
  }

  return Country
}
