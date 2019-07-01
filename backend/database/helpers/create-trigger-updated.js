const createTriggerUpdated = async (queryInterface, tableName) => {
  return queryInterface.sequelize.query(
    `CREATE TRIGGER "updated" BEFORE INSERT OR UPDATE ON "${tableName}" FOR EACH ROW EXECUTE PROCEDURE trigger_updated();`,
    { raw: true }
  )
}

module.exports = createTriggerUpdated
