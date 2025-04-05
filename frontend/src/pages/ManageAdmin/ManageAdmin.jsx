import React, { useState, useEffect } from 'react';
import './ManageAdmin.css';
import api from '../../api';

const SuperAdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [normalUsers, setNormalUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [assignedUsers, setAssignedUsers] = useState({}); 

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/admin/userslist/");
      if (response.status === 200) {
        const all = response.data;
        const adminList = all.filter(u => u.role === 'admin');
        const userList = all.filter(u => u.role === 'user');
        setUsers(all);
        setAdmins(adminList);
        setNormalUsers(userList);

        const defaultAssignments = {};
        adminList.forEach(admin => {
          defaultAssignments[admin.id] = [];
        });
        setAssignedUsers(defaultAssignments);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users');
    }
  };

  const handleUserAssignment = (adminId, userId, isChecked) => {
    setAssignedUsers(prev => {
      const updated = { ...prev };
      if (!updated[adminId]) {
        updated[adminId] = [];
      }

      if (isChecked) {
        updated[adminId] = [...updated[adminId], userId];
      } else {
        updated[adminId] = updated[adminId].filter(id => id !== userId);
      }

      return updated;
    });
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
          setUsers(prev => [...prev, response.data.user]);
          alert('User created successfully!');
          closeModal();
        }
      } catch (error) {
        console.error('Error creating user:', error);
        alert(error.response?.data?.error || 'Failed to create user');
      }
    } else {
      alert('Please fill all fields');
    }
  };

  return (
    <div className="container">
      <h2>All Users Management</h2>
      <button className="btn" onClick={openModal}>Create Admin</button>

      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
        
          </tr>
        </thead>
        <tbody>
          {admins.map((adminUser, index) => (
            <tr key={adminUser.id}>
              <td>{index + 1}</td>
              <td>{adminUser.username}</td>
              <td>{adminUser.email}</td>
              <td>{adminUser.phone}</td>
              <td>{adminUser.role}</td>
              
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create User</h3>
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
              <button className="btn" onClick={createUser}>Create</button>
              <button className="btn" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminPanel;
