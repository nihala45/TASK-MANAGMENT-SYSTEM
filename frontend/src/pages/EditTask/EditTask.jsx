import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";

const EditTask = () => {
  const { taskId } = useParams(); // get task ID from URL
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assigned_to: "",
    due_date: "",
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch users for the dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/api/admin/userslist/");
        const filteredUsers = response.data.filter(user => !user.is_superuser);
        setUsers(filteredUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Fetch task data
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get(`/api/tasks/${taskId}/`);
        setFormData({
          title: response.data.title,
          description: response.data.description,
          assigned_to: response.data.assigned_to,
          due_date: response.data.due_date,
        });
      } catch (err) {
        console.error("Error fetching task:", err);
      }
    };
    if (taskId) fetchTask();
  }, [taskId]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.put(`/api/tasks/${taskId}/`, formData);
      alert("Task updated successfully!");
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Failed to update task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-task-container">
      <h2>Edit Task</h2>
      {error && <p className="error">{error}</p>}
      <form className="edit-task-form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
        ></textarea>

        <label>Assign To</label>
        <select
          name="assigned_to"
          value={formData.assigned_to}
          onChange={handleChange}
          required
        >
          <option value="">-- Select User --</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.username} ({user.email})
            </option>
          ))}
        </select>

        <label>Due Date</label>
        <input
          type="date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Task"}
        </button>
      </form>
    </div>
  );
};

export default EditTask;
