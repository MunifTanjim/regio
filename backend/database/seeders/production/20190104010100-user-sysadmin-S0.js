'use strict'

const { hashPassword } = require('../../../libs/securepassword.js')

const PersonRow = {
  PersonId: 0,
  firstName: 'System',
  lastName: 'Administrator',
  dob: new Date('1990-01-01')
}

const ContactInfoRow = {
  PersonId: 0,
  type: ['current', 'personal'],
  email: 'sysadmin@example.com'
}

const UserRow = {
  UserId: 'S0',
  PersonId: 0,
  password: 'sysadmin',
  approved: true
}

const UserRolesRow = {
  UserId: 'S0',
  RoleId: 'sysadmin'
}

const StaffRow = {
  StaffId: 0,
  UserId: 'S0'
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.bulkInsert('Persons', [PersonRow], {
        ignoreDuplicates: true,
        transaction
      })

      await queryInterface.bulkInsert('ContactInfos', [ContactInfoRow], {
        ignoreDuplicates: true,
        transaction
      })

      UserRow.password = await hashPassword(UserRow.password)

      await queryInterface.bulkInsert('Users', [UserRow], {
        ignoreDuplicates: true,
        transaction
      })

      await queryInterface.bulkInsert('UserRoles', [UserRolesRow], {
        ignoreDuplicates: true,
        transaction
      })

      await queryInterface.bulkInsert('Staffs', [StaffRow], {
        ignoreDuplicates: true,
        transaction
      })
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Persons', {
      PersonId: PersonRow.PersonId
    })
  }
}
