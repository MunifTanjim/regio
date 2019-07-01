'use strict'

module.exports = (sequelize, DataTypes) => {
  const Research = sequelize.define(
    'Research',
    {
      TermId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'Terms',
          key: 'TermId'
        }
      },
      CourseId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'Courses',
          key: 'CourseId'
        }
      },
      StudentId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'Students',
          key: 'StudentId'
        }
      },
      TeacherId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        onDelete: 'cascade',
        onUpdate: 'cascade',
        references: {
          model: 'Teachers',
          key: 'TeacherId'
        }
      }
    },
    {
      tableName: 'Researches',
      name: { plural: 'Researches' },
      createdAt: 'created',
      updatedAt: 'updated'
    }
  )

  Research.associate = () => {}

  return Research
}
