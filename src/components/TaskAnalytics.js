import React from 'react';
import { useAnalytics } from '../contexts/AnalyticsContext';
import './TaskAnalytics.css';

                                                                 

const TaskAnalytics = ({ teamId }) => {
  const { 
    teamPerformance, 
    taskStats, 
    loading, 
    error,
    calculateTeamEfficiency,
    calculateProjection 
  } = useAnalytics();
  
  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!teamPerformance || !taskStats) return <div>No data available</div>;
  
                      

  const teamData = teamPerformance.teams.find(team => team.id === teamId);
  
  if (!teamData) {
    return <div>No data available for this team</div>;
  }
  
                                                                                

  const efficiency = calculateTeamEfficiency(teamId);
  
                                                      

  const projectedDays = calculateProjection(teamId, 10);
  
                                          

  const completionRate = teamPerformance.completionRates.find(
    rate => rate.teamId === teamId
  )?.completionRate || 0;
  
  return (
    <div className="analytics-container">
      <h2>Team Performance Analytics</h2>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Task Completion Rate</h3>
          <div className="metric-value">{(completionRate * 100).toFixed(1)}%</div>
          <div className="metric-description">
            {teamData.completedTasks} completed out of {teamData.assignedTasks} assigned
          </div>
        </div>
        
        <div className="metric-card">
          <h3>Average Completion Time</h3>
          <div className="metric-value">
            {(taskStats.avgCompletionTime / (1000 * 60 * 60 * 24)).toFixed(1)} days
          </div>
          <div className="metric-description">
            Based on {taskStats.completedTasks.length} completed tasks
          </div>
        </div>
        
        <div className="metric-card">
          <h3>Team Efficiency</h3>
          <div className="metric-value">
            {efficiency.toFixed(2)} tasks/hour
          </div>
          <div className="metric-description">
            Based on {teamData.totalWorkHours || 0} work hours
          </div>
        </div>
        
        <div className="metric-card">
          <h3>Projection</h3>
          <div className="metric-value">
            {projectedDays.toFixed(1)} days
          </div>
          <div className="metric-description">
            Estimated time to complete 10 more tasks
          </div>
        </div>
      </div>
      
      <div className="status-breakdown">
        <h3>Tasks by Status</h3>
        <div className="status-bars">
          {Object.entries(taskStats.statusBreakdown).map(([status, count]) => (
            <div key={status} className="status-bar-container">
              <div className="status-label">{status}</div>
              <div 
                className={`status-bar status-${status.toLowerCase()}`}
                style={{ width: `${(count / taskStats.totalTasks) * 100}%` }}
              ></div>
              <div className="status-count">{count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskAnalytics;