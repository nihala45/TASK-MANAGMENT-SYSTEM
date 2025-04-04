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
        console.log("here is")

        const response = await api.get('api/admin/tasks/');
        console.log("here is",response)
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
