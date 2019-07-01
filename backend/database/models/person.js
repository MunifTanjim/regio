'use strict'

module.exports = (sequelize, DataTypes) => {
  const Person = sequelize.define(
    'Person',
    {
      PersonId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      firstName: {
        allowNull: false,
        type: DataTypes.STRING
      },
      middleName: {
        type: DataTypes.STRING
      },
      lastName: {
        allowNull: false,
        type: DataTypes.STRING
      },
      dob: {
        type: DataTypes.DATEONLY
      }
    },
    {
      tableName: 'Persons',
      name: { plural: 'Persons' },
      createdAt: 'created',
      updatedAt: 'updated'
    }
  )

  Person.associate = ({ ContactInfo, User }) => {
    Person.ContactInfos = Person.hasMany(ContactInfo, {
      foreignKey: 'PersonId'
    })
    Person.User = Person.hasOne(User, { foreignKey: 'PersonId' })
  }

  return Person
}
