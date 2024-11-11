import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './assets/EmpBg.jpg';
import Navbar from './Navbar';


const EmployeeLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const authenticateEmployee = (username, password) => {
        const employeeDatabase = [
            { username: 'Madhi', password: 'madhi1' },
            { username: 'Anitha', password: 'ann1' },
            { username: 'Haripriya', password: 'priya1' },
        ];
        return employeeDatabase.some(
            (employee) => employee.username === username && employee.password === password
        );
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (authenticateEmployee(username, password)) {
            setMessage("Login successful!");
            navigate('/EmployeeWork', { state: { username } });
        } else {
            setMessage("Invalid username or password.");
        }
    };

    return (<>
    <Navbar/>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' , backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
            <form onSubmit={handleLogin} style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', width: '300px',
                backgroundColor:' #1b1b1b6f', }}>
                <h2>Audit Personnel Login</h2>
                {message && <p style={{ color: message.includes("successful") ? 'green' : 'red' }}>{message}</p>}
                <div style={{ marginBottom: '15px' }}>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ width: '100%', padding: '8px', margin: '5px 0' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '8px', margin: '5px 0' }}
                        required
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>
                    Login
                </button>
            </form>
        </div></> 
    );
};

export default EmployeeLogin;
