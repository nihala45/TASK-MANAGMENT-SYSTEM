import React, { useState } from 'react';
import './manageadmin.css';

const ManageAdmin = () => {
  const [admins, setAdmins] = useState([
    { id: 1, username: "admin1", email: "admin1@example.com", role: "admin" },
    { id: 2, username: "admin2", email: "admin2@example.com", role: "admin" }
  ]);
  const [form, setForm] = useState({ username: "", email: "", phone: "", password: "" });
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("user");

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateAdmin = (e) => {
    e.preventDefault();
    const newAdmin = {
      id: Date.now(),
      username: form.username,
      email: form.email,
      phone: form.phone,
      role: "admin"
    };
    setAdmins([...admins, newAdmin]);
    setForm({ username: "", email: "", phone: "", password: "" });
  };

  const handleDelete = (id) => {
    setAdmins(admins.filter(admin => admin.id !== id));
  };

  const handlePromoteDemote = (id) => {
    setAdmins(admins.map(admin =>
      admin.id === id
        ? { ...admin, role: admin.role === 'admin' ? 'user' : 'admin' }
        : admin
    ));
  };

  const openRoleModal = (id) => {
    setSelectedAdminId(id);
    setShowRoleModal(true);
  };

  const assignRole = () => {
    setAdmins(admins.map(admin =>
      admin.id === selectedAdminId
        ? { ...admin, role: selectedRole }
        : admin
    ));
    setShowRoleModal(false);
  };

  return (
    <div className="manage-admin-container">
      <h2>SuperAdmin - Manage Admins</h2>

      <form className="create-admin-form" onSubmit={handleCreateAdmin}>
        <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleInputChange} required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleInputChange} required />
        <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleInputChange} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleInputChange} required />
        <button type="submit">Create Admin</button>
      </form>

      <table className="admins-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin, index) => (
            <tr key={admin.id}>
              <td>{index + 1}</td>
              <td>{admin.username}</td>
              <td>{admin.email}</td>
              <td>{admin.role}</td>
              <td>
                <button onClick={() => openRoleModal(admin.id)}>Assign Role</button>
                <button onClick={() => handlePromoteDemote(admin.id)}>
                  {admin.role === 'admin' ? 'Demote' : 'Promote'}
                </button>
                <button onClick={() => handleDelete(admin.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showRoleModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Assign Role</h3>
            <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div className="modal-actions">
              <button onClick={assignRole}>Assign</button>
              <button onClick={() => setShowRoleModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAdmin;
