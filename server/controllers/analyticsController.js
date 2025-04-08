const { Task, User, Project, sequelize } = require('../models');
const { Op } = require('sequelize');

                   

   
                                                
                                                                      
   
exports.getTeamPerformance = async (req, res) => {
  try {
                                                                                 

                                                                      

    const teams = await User.findAll({
      attributes: [
        'id',
        'username',
        [sequelize.fn('COUNT', sequelize.col('assignedTasks.id')), 'assignedTasks'],
        [
                                                                      

                                                                             

          sequelize.literal(`(
            SELECT COUNT(*) 
            FROM tasks 
            WHERE tasks.assigneeId = User.id AND tasks.status = 'completed'
          )`),
          'completedTasks'
        ],
        [
                                                                                    

          sequelize.literal(`(
            SELECT SUM(TIMESTAMPDIFF(HOUR, tasks.createdAt, IFNULL(tasks.completedAt, NOW()))) 
            FROM tasks 
            WHERE tasks.assigneeId = User.id
          )`),
          'totalWorkHours'
        ],
        [
                                                                             

          sequelize.literal(`(
            SELECT COUNT(DISTINCT DATE(tasks.createdAt)) 
            FROM tasks 
            WHERE tasks.assigneeId = User.id
          )`),
          'workDays'
        ]
      ],
      include: [{
        model: Task,
        as: 'assignedTasks',
        attributes: [],                                      

        required: false
      }],
      group: ['User.id'],
      raw: true
    });

                                                                         

                                             

    res.json({
      teams: teams.map(team => ({
        id: team.id,
        name: team.username,
        assignedTasks: parseInt(team.assignedTasks),
        completedTasks: parseInt(team.completedTasks),
        totalWorkHours: parseInt(team.totalWorkHours || 0),
        workDays: parseInt(team.workDays || 1)
      })),
      timeframe: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),               

        end: new Date()
      }
    });
  } catch (error) {
    console.error('Error fetching team performance data:', error);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
};

exports.getTaskStatistics = async (req, res) => {
  try {
                                                                

                                                                           

    const tasksByStatus = await Task.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });
    
                                                                                      

    const completedTasks = await Task.findAll({
      attributes: ['id', 'createdAt', 'completedAt', 'priority'],
      where: {
        status: 'completed',
        completedAt: { [Op.not]: null }
      },
      raw: true
    });
    
                                                                                 

    const tasksByPriority = await Task.findAll({
      attributes: [
        'priority',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['priority'],
      raw: true
    });
    
                                                 

    const statusCounts = tasksByStatus.reduce((acc, curr) => {
      acc[curr.status] = parseInt(curr.count);
      return acc;
    }, {});
    
    const priorityCounts = tasksByPriority.reduce((acc, curr) => {
      acc[curr.priority] = parseInt(curr.count);
      return acc;
    }, {});
    
    res.json({
      statusBreakdown: statusCounts,
      priorityBreakdown: priorityCounts,
      completedTasks: completedTasks,
      totalTasks: Object.values(statusCounts).reduce((sum, count) => sum + count, 0)
    });
  } catch (error) {
    console.error('Error fetching task statistics:', error);
    res.status(500).json({ message: 'Error fetching task statistics' });
  }
};
                   
