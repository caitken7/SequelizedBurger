// Burger Eater Model
'use strict';
module.exports = function(sequelize, DataTypes) {
  var devourers = sequelize.define('devourers', {
    devourer_name: DataTypes.STRING,
    burgerId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // Unecessary, the hasOne() function exists in the burger model
        devourers.belongsTo(models.burgers);
      }
    }
  });
  return devourers;
};