import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import './ManageTasks.css';

const ManageTask = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('api/admin/tasks/');
        const data = response.data;
        if (Array.isArray(data)) {
          setTasks(data);
        } else if (data && Array.isArray(data.tasks)) {
          setTasks(data.tasks);
        } else {
          console.error('Unexpected tasks format:', data);
          setTasks([]);
          setError('Unexpected data format received from server.');
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again.');
      }
    };

    fetchTasks();
  }, []);

  
  const deleteTask = async (taskId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    try {
      await api.delete(`api/tasks/${taskId}/`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
      setError('Failed to delete the task. Please try again.');
    }
  };

  return (
    <div className="manage-task-container">
      <h2>Manage Tasks</h2>

      <div className="button-wrapper">
        <button className="create-task-btn" onClick={() => navigate('/CreateTask')}>
          Create Task
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}

      {Array.isArray(tasks) && tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        Array.isArray(tasks) && (
          <table className="task-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Assigned To</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Completion Report</th>
                <th>Worked Hours</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.assigned_to}</td>
                  <td>{task.due_date}</td>
                  <td>{task.status}</td>
                  <td>{task.status === 'Completed' ? task.completion_report : '-'}</td>
                  <td>{task.status === 'Completed' ? task.worked_hours : '-'}</td>
                  <td>
                    <button
                      className="create-task-btn"
                      onClick={() => navigate(`/EditTask/${task.id}`)}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      className="create-task-btn delete-btn"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
};

export default ManageTask;
