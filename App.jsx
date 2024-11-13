import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Dashboard from '../public/Dashboard';
import Inventory from './Inventory';
import UserManagement from './UserManagement';
import Signup from '../public/Signup';
import Login from './Login';
import './App.css';


const App = () => {
    const [users, setUsers] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [products, setProducts] = useState([]);

    const handleSignup = (newUser) => {
        const userExists = users.some(user => user.username === newUser.username);
        if (userExists) {
            alert('User already exists. Please choose a different username.');
            return;
        }
        setUsers([...users, newUser]);
        alert('Signup successful! You can now log in.');
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <Router>
            <div className="App">
                <h1>Wings Cafe Inventory System</h1>
                <nav>
                    {!isLoggedIn ? (
                        <>
                            <Link to="/signup">Sign Up</Link>
                            <Link to="/login">Login</Link>
                        </>
                    ) : (
                        <>
                            <button onClick={handleLogout}>Logout</button>
                            <Link to="/dashboard">Dashboard</Link>
                            <Link to="/inventory">Products</Link>
                            <Link to="/usermanagement">User Management</Link>
                        </>
                    )}
                </nav>
                <Routes>
                    <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
                    <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} users={users} />} />
                    <Route path="/dashboard" element={isLoggedIn ? <Dashboard products={products} /> : <Navigate to="/login" />} />
                    <Route path="/inventory" element={isLoggedIn ? <Inventory products={products} setProducts={setProducts} /> : <Navigate to="/login" />} />
                    <Route path="/usermanagement" element={isLoggedIn ? <UserManagement /> : <Navigate to="/login" />} />
                    <Route path="/" element={<h2>Welcome! Please Sign Up or Login</h2>} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
