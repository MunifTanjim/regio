module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    sid: {
      type: DataTypes.STRING(36),
      primaryKey: true
    },
    data: DataTypes.TEXT,
    expiresAt: DataTypes.DATE
  })

  Session.associate = () => {}

  return Session
}
