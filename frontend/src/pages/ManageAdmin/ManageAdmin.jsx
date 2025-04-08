import React, { useState, useEffect } from 'react';
import './ManageAdmin.css';
import api from '../../api';

const ManageAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [taskInputs, setTaskInputs] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [editModal, setEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await api.get("/api/admin/userslist/");
      if (response.status === 200) {
        const adminList = response.data.filter(u => u.role === 'admin');
        setAdmins(adminList);
        const initialTasks = {};
        adminList.forEach(admin => initialTasks[admin.id] = '');
        setTaskInputs(initialTasks);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      alert('Failed to fetch admins');
    }
  };

  const handleTaskChange = (adminId, value) => {
    setTaskInputs(prev => ({ ...prev, [adminId]: value }));
  };

  const assignWork = async (adminId) => {
    const task = taskInputs[adminId];
    if (!task) {
      alert('Please enter a task');
      return;
    }
  
    try {
      const response = await api.post('/api/assign-task-to-admin/', {
        admin_id: adminId,
        title: task,
      });
  
      if (response.status === 201) {
        alert('Task assigned successfully');
        setTaskInputs(prev => ({ ...prev, [adminId]: '' }));
      }
    } catch (error) {
      console.error('Error assigning task:', error);
      alert(error.response?.data?.error || 'Failed to assign task');
    }
  };
  

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setFormData({ name: '', email: '', password: '', phone: '' });
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const createUser = async () => {
    const { name, email, password, phone } = formData;
    if (name && email && password && phone) {
      try {
        const response = await api.post('/api/create-admin/', {
          username: name,
          email,
          password,
          phone,
        });

        if (response.status === 201) {
          alert('Admin created successfully!');
          closeModal();
          fetchAdmins();
        }
      } catch (error) {
        console.error('Error creating admin:', error);
        alert(error.response?.data?.error || 'Failed to create admin');
      }
    } else {
      alert('Please fill all fields');
    }
  };

  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      name: admin.username,
      email: admin.email,
      phone: admin.phone,
      password: '',
    });
    setEditModal(true);
  };

  const updateAdmin = async () => {
    try {
      const response = await api.put(`/api/edit-admin/${selectedAdmin.id}/`, {
        username: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      if (response.status === 200) {
        alert('Admin updated successfully');
        setEditModal(false);
        fetchAdmins();
      }
    } catch (error) {
      console.error('Error updating admin:', error);
      alert('Failed to update admin');
    }
  };

  return (
    <div className="container">
      <h2>Admin Work Assignment</h2>
      <button className="btn" onClick={openModal}>Create Admin</button>

      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Admin</th>
            <th>Email</th>
            <th>Assign Work</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin, index) => (
            <tr key={admin.id}>
              <td>{index + 1}</td>
              <td>{admin.username}</td>
              <td>{admin.email}</td>
              <td>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter work"
                  value={taskInputs[admin.id] || ''}
                  onChange={(e) => handleTaskChange(admin.id, e.target.value)}
                />
                <button className="btn" onClick={() => assignWork(admin.id)}>Assign</button>
              </td>
              <td>
                <button className="btn" onClick={() => openEditModal(admin)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create Admin</h3>
            <input className="input" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
            <input className="input" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            <input className="input" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
            <input className="input" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
            <div>
              <button className="btn" onClick={createUser}>Create</button>
              <button className="btn" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Admin</h3>
            <input className="input" name="name" value={formData.name} onChange={handleChange} />
            <input className="input" name="email" value={formData.email} onChange={handleChange} />
            <input className="input" name="phone" value={formData.phone} onChange={handleChange} />
            <input className="input" name="password" placeholder="New password (optional)" value={formData.password} onChange={handleChange} />
            <div>
              <button className="btn" onClick={updateAdmin}>Update</button>
              <button className="btn" onClick={() => setEditModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAdmin;
