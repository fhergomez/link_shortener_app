'use strict';
module.exports = function(sequelize, DataTypes) {
  var link = sequelize.define('link', {
    url: DataTypes.STRING,
    clickCount:
    {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return link;
};