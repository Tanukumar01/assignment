const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: config.logging
});

               

const User = require('./User')(sequelize);
const Task = require('./Task')(sequelize);
const Project = require('./Project')(sequelize);
const Comment = require('./Comment')(sequelize);

                    

User.associate({ Task, Project });
Task.associate({ User, Project, Comment });
Project.associate({ User, Task });
Comment.associate({ User, Task });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Task,
  Project,
  Comment
};