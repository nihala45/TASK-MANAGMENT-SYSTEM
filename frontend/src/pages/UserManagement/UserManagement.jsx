import React, { useState, useEffect } from "react";
import "./UserManagement.css";

const UserManagement = () => {
    // Sample user data (Replace this with API data later)
    const [users, setUsers] = useState([
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
        { id: 3, name: "Mike Johnson", email: "mike@example.com" },
    ]);

    const [editingUser, setEditingUser] = useState(null);
    const [editedName, setEditedName] = useState("");
    const [editedEmail, setEditedEmail] = useState("");

    // Handle edit button click
    const startEditing = (user) => {
        setEditingUser(user);
        setEditedName(user.name);
        setEditedEmail(user.email);
    };

    // Handle saving edited user
    const saveEdit = () => {
        setUsers(users.map((user) =>
            user.id === editingUser.id ? { ...user, name: editedName, email: editedEmail } : user
        ));
        setEditingUser(null);
    };

    // Handle deleting a user
    const deleteUser = (id) => {
        setUsers(users.filter(user => user.id !== id));
    };

    return (
        <div className="container">
            <h2>User Management</h2>

            {/* User List Table */}
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="3">No users available</td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button onClick={() => startEditing(user)} className="edit-button">Edit</button>
                                    <button onClick={() => deleteUser(user.id)} className="delete-button">Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Edit User Modal */}
            {editingUser && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Edit User</h3>
                        <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="input"
                        />
                        <input
                            type="email"
                            value={editedEmail}
                            onChange={(e) => setEditedEmail(e.target.value)}
                            className="input"
                        />
                        <div className="modal-buttons">
                            <button onClick={saveEdit} className="submit-button">Save</button>
                            <button onClick={() => setEditingUser(null)} className="cancel-button">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
