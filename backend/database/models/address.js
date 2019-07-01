'use strict'

module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define(
    'Address',
    {
      ContactInfoId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'ContactInfos',
          key: 'ContactInfoId'
        }
      },
      line1: {
        allowNull: false,
        type: DataTypes.STRING
      },
      line2: {
        allowNull: false,
        type: DataTypes.STRING
      },
      line3: {
        type: DataTypes.STRING
      },
      city: {
        allowNull: false,
        type: DataTypes.STRING
      },
      region: {
        type: DataTypes.STRING
      },
      postalCode: {
        allowNull: false,
        type: DataTypes.STRING
      },
      CountryId: {
        allowNull: false,
        type: DataTypes.SMALLINT,
        references: {
          model: 'Countries',
          key: 'CountryId'
        }
      }
    },
    { createdAt: 'created', updatedAt: 'updated' }
  )

  Address.associate = ({ ContactInfo, Country }) => {
    Address.ContactInfo = Address.belongsTo(ContactInfo, {
      foreignKey: 'ContactInfoId'
    })
    Address.Country = Address.belongsTo(Country, { foreignKey: 'CountryId' })
  }

  return Address
}
