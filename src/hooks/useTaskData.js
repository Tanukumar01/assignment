import { useState, useEffect, useCallback } from 'react';
import { fetchTasks } from '../api/taskApi';

                   

   
                                                     
                                            
                                                  
                                   
                                                 
   
const useTaskData = (filters = {}, pageSize = 10) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
                                                       

  const loadTasks = useCallback(async (currentPage = 1) => {
    try {
      setLoading(true);
                                                         

      const response = await fetchTasks({
        ...filters,
        page: currentPage,
        pageSize
      });
      
      setTasks(response.tasks);
      setTotalPages(Math.ceil(response.total / pageSize));
      setLoading(false);
      
                                                          

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [filters, pageSize]);
  
                                                                

  useEffect(() => {
    loadTasks(page);
                                                  

  }, [page, loadTasks]);
  
                                                               

  const updateTask = async (taskId, updatedData) => {
    try {
      await updateTask(taskId, updatedData);
                                                                                     

      await loadTasks(page);
    } catch (err) {
      setError(err.message);
    }
  };
  
  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };
  
  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  
  return {
    tasks,
    loading,
    error,
    page,
    totalPages,
    nextPage,
    prevPage,
    updateTask,
                                            

  };
};
                   


export default useTaskData;