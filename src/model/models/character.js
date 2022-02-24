const { DataTypes } = require('sequelize');

function createModel(sequelize) {
  const Character = sequelize.define('character', {
    name: {
      type: DataTypes.STRING(60),
      unique: true,
    },
    image: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    weight: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    story: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
    {
      timestamps: false,
    });
  return Character;
}

module.exports = {
  createModel,
};
