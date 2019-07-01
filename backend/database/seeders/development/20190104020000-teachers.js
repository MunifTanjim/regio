'use strict'

const { hashPassword } = require('../../../libs/securepassword.js')

const teacherSeeds = require('../../helpers/seeds/teachers.js')

const { Person, Teacher, User } = require('../../index.js')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      for (const data of teacherSeeds) {
        const exists = await Teacher.findByPk(data.TeacherId, {
          transaction
        })

        if (exists) continue

        data.User.password = await hashPassword(data.User.password)

        const teacher = await Teacher.create(data, {
          include: [
            {
              association: Teacher.User,
              include: [
                {
                  association: User.Person,
                  include: [
                    {
                      association: Person.ContactInfos
                    }
                  ]
                }
              ]
            }
          ],
          transaction
        })

        await teacher.User.setRoles(['teacher'], {
          transaction
        })
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      const users = await User.findAll({
        attributes: ['UserId', 'PersonId'],
        where: {
          UserId: {
            [Sequelize.Op.in]: teacherSeeds.map(t => t.User.UserId)
          }
        },
        transaction
      })

      const UserIds = users.map(user => user.get('UserId'))
      const PersonIds = users.map(user => user.get('PersonId'))

      await queryInterface.bulkDelete(
        'Users',
        {
          UserId: {
            [Sequelize.Op.in]: UserIds
          }
        },
        { transaction }
      )

      await queryInterface.bulkDelete(
        'Persons',
        {
          PersonId: {
            [Sequelize.Op.in]: PersonIds
          }
        },
        { transaction }
      )
    })
  }
}
