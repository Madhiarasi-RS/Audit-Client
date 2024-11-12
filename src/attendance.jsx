import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';

const AttendanceCircle = ({ attendanceCount }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <CircularProgress
        variant="determinate"
        value={attendanceCount}
        thickness={5}
        size={80}
        style={{ marginBottom: '10px' }}
      />
      <span>{attendanceCount}%</span>
    </div>
  );
};

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:8000/employees');
      const data = await response.json();
      setEmployees(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setLoading(false);
    }
  };

  const updateAttendance = async (employeeId, increase) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/employees/${employeeId}/attendance`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ increase }),
      });
      const updatedEmployee = await response.json();
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee._id === updatedEmployee._id ? updatedEmployee : employee
        )
      );
    } catch (error) {
      console.error('Error updating attendance:', error);
    } finally {
      setLoading(false);
    }
  };
  const decreaseAttendance = async (employeeId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/employees/${employeeId}/attendance`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decrease: true }), // This sends the 'decrease' flag to the backend
      });
  
      if (!response.ok) {
        throw new Error('Failed to decrease attendance');
      }
  
      const updatedEmployee = await response.json();
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee._id === updatedEmployee._id ? updatedEmployee : employee
        )
      );
    } catch (error) {
      console.error('Error decreasing attendance:', error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '20px' }}>Employee Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {employees.map((employee) => (
            <div
              key={employee._id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '16px',
                margin: '16px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#f9f9f9',
              }}
            >
              <h2 style={{ marginBottom: '10px' }}>{employee.name}</h2>
              <AttendanceCircle attendanceCount={employee.attendanceCount} />
              <button
                onClick={() => updateAttendance(employee._id, true)}
                style={{
                  padding: '10px 20px',
                  margin: '5px',
                  cursor: 'pointer',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                }}
              >
                Increase Attendance
              </button>
              <button
                onClick={() => decreaseAttendance(employee._id, false)}
                style={{
                  padding: '10px 20px',
                  margin: '5px',
                  cursor: 'pointer',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                }}
              >
                Decrease Attendance
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
