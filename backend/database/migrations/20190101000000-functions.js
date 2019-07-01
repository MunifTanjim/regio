'use strict'

const triggerUpdatedUpQuery = `BEGIN;
CREATE OR REPLACE FUNCTION trigger_updated()
RETURNS TRIGGER AS $trigger_updated$
BEGIN
  NEW."updated" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$trigger_updated$ LANGUAGE plpgsql;
COMMIT;`

const triggerUpdatedDownQuery = `DROP FUNCTION IF EXISTS trigger_updated();`

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(triggerUpdatedUpQuery, {
      raw: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(triggerUpdatedDownQuery, {
      raw: true
    })
  }
}
