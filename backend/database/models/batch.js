'use strict'

module.exports = (sequelize, DataTypes) => {
  const Batch = sequelize.define(
    'Batch',
    {
      BatchId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      coordinatorId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Teachers',
          key: 'TeacherId'
        }
      }
    },
    { createdAt: 'created', updatedAt: 'updated' }
  )

  Batch.associate = ({ Student }) => {
    Batch.Students = Batch.hasMany(Student, { foreignKey: 'BatchId' })
  }

  return Batch
}
