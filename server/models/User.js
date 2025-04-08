const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Task, { foreignKey: 'assigneeId', as: 'assignedTasks' });
      User.hasMany(models.Task, { foreignKey: 'creatorId', as: 'createdTasks' });
      User.belongsToMany(models.Project, { through: 'ProjectMembers', foreignKey: 'userId' });
    }
  }
  
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'manager', 'developer'),
      defaultValue: 'developer'
    },
    tokenVersion: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true
  });
  
  return User;
};