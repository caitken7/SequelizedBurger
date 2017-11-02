// Burger Model
'use strict';
module.exports = function(sequelize, DataTypes) {
  var burger = sequelize.define('burger', {
    burger_name: DataTypes.STRING,
    devoured: DataTypes.BOOLEAN,
    devourerId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // Each of the burgers has one of the devourers associated with it (key is stored on the devourer)
        burger.hasOne(models.devourers)
      }
    }
  });
  return burger;
};

