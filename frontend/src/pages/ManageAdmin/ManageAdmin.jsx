import React, { useState } from 'react';
import './ManageAdmin.css';
import api from '../../api';

const SuperAdminPanel = () => {
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setFormData({ name: '', email: '', password: '', phone: '' });
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  

const createAdmin = async () => {
  const { name, email, password, phone } = formData;

  if (name && email && password && phone) {
    const newAdmin = {
      username: name,
      email: email,
      password: password,
      phone: phone,
    };

    try {
      const response = await api.post('/api/create-admin/', newAdmin);

      if (response.status === 201) {
        setAdmins((prevAdmins) => [...prevAdmins, response.data.user]);
        alert('Admin created successfully!');
        closeModal();
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      alert(error.response?.data?.error || 'Failed to create admin');
    }
  } else {
    alert('Please fill all fields');
  }
};


  const deleteAdmin = (index) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      const updated = [...admins];
      updated.splice(index, 1);
      setAdmins(updated);
    }
  };

  const toggleRole = (index) => {
    const updated = [...admins];
    updated[index].role = updated[index].role === 'Admin' ? 'Moderator' : 'Admin';
    setAdmins(updated);
  };

  return (
    <div className="container">
      <h2>SuperAdmin Panel</h2>
      <button className="btn" onClick={openModal}>Create Admin</button>

      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{admin.name}</td>
              <td>{admin.email}</td>
              <td>{admin.phone}</td>
              <td>{admin.role}</td>
              <td>
                <button className="btn" onClick={() => toggleRole(index)}>Promote/Demote</button>
                <button className="btn" onClick={() => deleteAdmin(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create Admin</h3>
            <input
              className="input"
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              className="input"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              className="input"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <input
              className="input"
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
            <div>
              <button className="btn" onClick={createAdmin}>Create</button>
              <button className="btn" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminPanel;
