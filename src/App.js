import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Employ from './employee';
import HomePage from './HomePage';
import Login from './Login';
import EmployeeWork from './EmployeeWork';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import EmployeeLogin from './EmployeeLogin';


function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<HomePage />} />
        <Route path="/employee" element={<Employ />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />
        <Route path="/EmployeeLogin" element={<EmployeeLogin/>} />
        <Route path="/EmployeeWork" element={<EmployeeWork />} /> {/* Corrected path */}
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
