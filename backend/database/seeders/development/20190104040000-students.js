'use strict'

const { hashPassword } = require('../../../libs/securepassword.js')

const studentSeeds = require('../../helpers/seeds/students.js')

const { Person, Student, User } = require('../../index.js')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      for (const data of studentSeeds) {
        const exists = await Student.findByPk(data.StudentId, {
          transaction
        })

        if (exists) continue

        data.User.password = await hashPassword(data.User.password)

        const student = await Student.create(data, {
          include: [
            {
              association: Student.User,
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

        await student.User.setRoles(['student'], {
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
            [Sequelize.Op.in]: studentSeeds.map(t => t.User.UserId)
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
