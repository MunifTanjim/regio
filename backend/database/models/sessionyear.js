'use strict'

module.exports = (sequelize, DataTypes) => {
  const SessionYear = sequelize.define(
    'SessionYear',
    {
      SessionYearId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING(9)
      }
    },
    { createdAt: 'created', updatedAt: 'updated' }
  )

  SessionYear.associate = ({ Term }) => {
    SessionYear.Terms = SessionYear.hasMany(Term, {
      foreignKey: 'SessionYearId'
    })
  }

  return SessionYear
}
