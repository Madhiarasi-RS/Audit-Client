import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './assets/AdminBg.jpg';
import Navbar from './Navbar';


const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Replace with actual admin credentials or API call
    const adminCredentials = {
        username: "admin",
        password: "admin@123"
    };

    const handleLogin = (e) => {
        e.preventDefault();

        // Basic validation and credential check
        if (username === adminCredentials.username && password === adminCredentials.password) {
            setMessage("Login successful!");
            navigate('/AdminDashboard'); // Redirect to the employee page
        } else {
            setMessage("Invalid username or password.");
        }
    };

    return (
        <>
        <Navbar/>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
            <form onSubmit={handleLogin} style={{
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '320px',
                backgroundColor:'#131313',
                opacity: 0.8,
                
            }}>
                <h2 style={{ textAlign: 'center', color: '#fff', marginBottom: '20px' }}>Admin Login</h2>
                
                {message && <p style={{ color: message.includes("successful") ? 'green' : 'red', textAlign: 'center' }}>{message}</p>}

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#fff' }}>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            fontSize: '16px',
                            borderRadius: '4px',
                            border: '1px solid #ccc'
                        }}
                        required
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#fff' }}>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            fontSize: '16px',
                            borderRadius: '4px',
                            border: '1px solid #ccc'
                        }}
                        required
                    />
                </div>

                <button type="submit" style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '16px',
                    backgroundColor:'#2C5389' ,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}>
                    Login
                </button>
            </form>
        </div></>
    );
};

export default AdminLogin;
