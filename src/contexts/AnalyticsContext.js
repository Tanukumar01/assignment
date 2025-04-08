import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

                   

                    

const AnalyticsContext = createContext();

                                                  

export const AnalyticsProvider = ({ children }) => {
  const [teamPerformance, setTeamPerformance] = useState(null);
  const [taskStats, setTaskStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

                        

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [teamResponse, taskResponse] = await Promise.all([
          axios.get('/api/analytics/team-performance'),
          axios.get('/api/analytics/task-statistics')
        ]);
        
                                                              

                                                              

        const teamData = teamResponse.data;
        const processedTeamData = {
          ...teamData,
                                                                              

                                                                   

          completionRates: teamData.teams.map(team => ({
            teamId: team.id,
            teamName: team.name,
                                                                          

            completionRate: team.completedTasks / team.assignedTasks
          }))
        };
        
                                                                   

        const taskData = taskResponse.data;
        const processedTaskData = {
          ...taskData,
                                                                                         

                                    

          avgCompletionTime: taskData.completedTasks.reduce(
            (sum, task) => sum + (task.completedAt - task.createdAt),
            0
          ) / taskData.completedTasks.length
        };
        
        setTeamPerformance(processedTeamData);
        setTaskStats(processedTaskData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data');
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);
  
                                                              

  const calculateTeamEfficiency = (teamId) => {
    if (!teamPerformance) return 0;
    
    const team = teamPerformance.teams.find(t => t.id === teamId);
    if (!team) return 0;
    
                                                                             

                                                                           

    return team.completedTasks / (team.totalWorkHours || 1);
  };
  
                                                            

  const calculateProjection = (teamId, targetTasks) => {
    if (!teamPerformance) return 0;
    
    const team = teamPerformance.teams.find(t => t.id === teamId);
    if (!team || team.completedTasks === 0) return 0;
    
                                                                        

                                                      

    const tasksPerDay = team.completedTasks / team.workDays;
                                                     

    return targetTasks / tasksPerDay;
  };
  
  const value = {
    teamPerformance,
    taskStats,
    loading,
    error,
    calculateTeamEfficiency,
    calculateProjection
  };
  
  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

                                

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
                   
