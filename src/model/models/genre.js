const { DataTypes } = require('sequelize');

function createModel(sequelize) {
  const Genre = sequelize.define('genre', {
    name: {
      type: DataTypes.STRING(60),
      unique: true,
    },
    image: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
  },
    {
      timestamps: false,
    });
  return Genre;
}

module.exports = {
  createModel,
};
