import React, { useState, useEffect } from 'react';

const UserManagement = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [users, setUsers] = useState([]);

    // Fetch users when component mounts or after adding a new user
    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5116/api/users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers(); // Fetch users on component mount
    }, []); // Empty dependency array ensures it runs once when the component mounts

    // Add a new user to the database
    const addUser = async () => {
        if (!username || !password) return;

        const newUser = { username, password };
        try {
            const response = await fetch('http://localhost:5116/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });
            const result = await response.json();
            if (result.id) {  // Assuming the response contains the newly created user with an ID
                // Immediately update the UI by adding the new user
                setUsers([...users, result]);
            }
            // Refetch users to ensure the list is always up to date
            fetchUsers();  // Refetch users to sync with the backend
        } catch (error) {
            console.error('Error adding user:', error);
        }

        // Clear input fields after adding
        setUsername('');
        setPassword('');
    };

    // Delete a user from the database
    const deleteUser = async (id) => {
        try {
            const response = await fetch(`http://localhost:5116/api/users/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if (result.message === 'User deleted') {
                // Update the local list of users
                setUsers(users.filter(user => user.id !== id));
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div>
            <h1>User Management</h1>
            <div>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={addUser}>Add User</button>
            </div>

            <table border="1">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.password}</td> {/* You may want to avoid displaying passwords */}
                            <td>
                                <button onClick={() => deleteUser(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;
