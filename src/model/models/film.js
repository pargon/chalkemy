const { DataTypes } = require('sequelize');

function createModel(sequelize) {
  const Film = sequelize.define('film', {
    title: {
      type: DataTypes.STRING(60),
      unique: true,
    },
    image: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
    {
      timestamps: true,
    });
  return Film;
}

module.exports = {
  createModel,
};
