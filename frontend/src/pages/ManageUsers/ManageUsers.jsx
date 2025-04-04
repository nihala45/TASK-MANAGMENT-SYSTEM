import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from "react-router-dom";
import api from '../../api'
import './ManageUsers.css'
import EditUserModal from '../EditUserModel/EditUserModel';
import CreateUserModal from '../CreateUserModal/CreateUserModal';


const  MangementUsers= () => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false); 
    const navigate = useNavigate();
  
    const fetchUsers = async () => {
      try {
        const response = await api.get("/api/admin/userslist/", {});
        const filteredUsers = response.data.filter(
          (user) => !user.is_superuser && 
          (user.username.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    useEffect(() => {
      fetchUsers();
    }, [searchQuery]); 
    const blockUser = async (id) => {
      try {
        await api.post(`/api/admin/userslist/${id}/block/`);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id ? { ...user, is_active: false } : user
          )
        );
      } catch (error) {
        console.error("Error blocking user:", error);
      }
    };
  
    const unblockUser = async (id) => {
      try {
        await api.post(`/api/admin/userslist/${id}/unblock/`);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id ? { ...user, is_active: true } : user
          )
        );
      } catch (error) {
        console.error("Error unblocking user:", error);
      }
    };
  
    const handleEditClick = (user) => {
      setSelectedUser(user);
      setShowModal(true);
    };
  
    const handleSaveUser = async (updatedUser) => {
      try {
        const userToUpdate = { ...updatedUser };
 
  
        await api.put(`/api/admin/userslist/${updatedUser.id}/`, userToUpdate);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
          )
        );
        setShowModal(false);
      } catch (error) {
        console.error("Error saving user:", error);
      }
    };
  
    const handleDeleteClick = async (user) => {
      try {
        await api.delete(`/api/admin/userslist/${user.id}/`);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    };
  
    const handleSearch = (e) => {
      setSearchQuery(e.target.value);
    };
  
    const handleCreateUser = async (newUser) => {
      try {
        await api.post("/api/admin/userslist/", newUser, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        fetchUsers();
        setShowCreateModal(false);
      } catch (error) {
        console.error("Error creating user:", error);
      }
    };

  return (
    <>
    
      <div className="user-list-container">
        <div className="header">
          <h2>User List</h2>
          <button
            className="create-user-button"
            onClick={() => setShowCreateModal(true)}
          >
            Create User
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>role</th>

              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>

               
                <td>
                  {user.is_active ? (
                    <button
                      onClick={() => blockUser(user.id)}
                      style={{ background: "yellow", color: "black" }}
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      onClick={() => unblockUser(user.id)}
                      style={{ background: "green" }}
                    >
                      Unblock
                    </button>
                  )}
                  <button onClick={() => handleEditClick(user)}>Edit</button>
                  <button
                    style={{ background: "red" }}
                    onClick={() => handleDeleteClick(user)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedUser && (
          <EditUserModal
            show={showModal}
            handleClose={() => setShowModal(false)}
            user={selectedUser}
            handleSave={handleSaveUser}
          />
        )}
        {showCreateModal && (
          <CreateUserModal
            show={showCreateModal}
            handleClose={() => setShowCreateModal(false)}
            handleSave={handleCreateUser}
          />
        )}
      </div>
    </>
  );
};

export default MangementUsers;