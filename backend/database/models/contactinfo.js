'use strict'

module.exports = (sequelize, DataTypes) => {
  const validTypes = ['current', 'permanent', 'home', 'office', 'personal']

  const ContactInfo = sequelize.define(
    'ContactInfo',
    {
      ContactInfoId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      PersonId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Persons',
          key: 'PersonId'
        }
      },
      type: {
        allowNull: false,
        defaultValue: ['personal'],
        type: DataTypes.ARRAY(DataTypes.ENUM(validTypes))
      },
      email: {
        type: DataTypes.STRING
      },
      mobile: {
        type: DataTypes.STRING
      },
      phone: {
        type: DataTypes.STRING
      }
    },
    { createdAt: 'created', updatedAt: 'updated' }
  )

  ContactInfo.associate = ({ Address, Person }) => {
    ContactInfo.Address = ContactInfo.hasOne(Address, {
      foreignKey: 'ContactInfoId'
    })
    ContactInfo.Person = ContactInfo.belongsTo(Person, {
      foreignKey: 'PersonId'
    })
  }

  ContactInfo.validTypes = validTypes

  return ContactInfo
}
