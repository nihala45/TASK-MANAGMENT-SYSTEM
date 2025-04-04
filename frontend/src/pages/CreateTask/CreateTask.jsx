import React, { useState, useEffect } from "react";
import api from "../../api"; 
import "./CreateTask.css";

const CreateTask = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assigned_to: "",
    due_date: "",
  });

  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); 


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/api/admin/userslist/");
        const filteredUsers = response.data.filter((user) => !user.is_superuser);
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/api/tasks/create/", formData);
      alert("Task created successfully!");
      setFormData({
        title: "",
        description: "",
        assigned_to: "",
        due_date: "",
      });
    } catch (error) {
      console.error("Error creating task:", error);
      setError("Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-task-container">
      <h2>Create New Task</h2>
      {error && <p className="error">{error}</p>}
      <form className="create-task-form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description"
          rows={4}
          required
        ></textarea>

        <label>Assign To</label>
        <select name="assigned_to" value={formData.assigned_to} onChange={handleChange} required>
          <option value="">-- Select User --</option>
          {users.map((user) => (
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
          {loading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
  );
};

export default CreateTask;
