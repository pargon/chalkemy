const { DataTypes } = require('sequelize');

function createModel(sequelize) {
  const User = sequelize.define('user', {
    userid: {
      type: DataTypes.STRING(60),
      unique: true,
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    lastname: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    mail: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
  },
  {
    timestamps: false,
  });
  return User;
}

module.exports = {
  createModel,
};
