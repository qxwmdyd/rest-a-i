'use strict';
module.exports = (sequelize, DataTypes) => {
  const foods = sequelize.define('foods', {
    name: DataTypes.STRING,
    price: DataTypes.INTEGER
  }, {
    timestamps: false,  //去除createAt updateAt
    freezeTableName: true,  //使用自定义表名
  });
  foods.associate = function(models) {
    // associations can be defined here
  };
  return foods;
};
