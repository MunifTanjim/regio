'use strict'

module.exports = (sequelize, DataTypes) => {
  const RoutineSlot = sequelize.define(
    'RoutineSlot',
    {
      RoutineSlotId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      startTime: {
        allowNull: false,
        type: DataTypes.TIME
      },
      endTime: {
        allowNull: false,
        type: DataTypes.TIME
      }
    },
    { createdAt: 'created', updatedAt: 'updated' }
  )

  RoutineSlot.associate = () => {}

  return RoutineSlot
}
