import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// Function to get the circle color based on attendance count
const getCircleColor = (attendanceCount) => {
  if (attendanceCount >= 30) return '#4caf50';
  if (attendanceCount >= 10) return '#ff9800';
  return '#f44336';
};

const AttendanceCircle = ({ attendanceCount }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '25px',
        width: '100px',
        height: '100px',
        marginBottom: '10px',
        position: 'relative',
      }}
    >
      <CircularProgressbar
        value={attendanceCount}
        text={`${attendanceCount}%`}
        styles={buildStyles({
          pathColor: getCircleColor(attendanceCount),
          textColor: '#000',
          trailColor: '#e0e0e0',
          textSize: '16px',
          pathTransitionDuration: 0.5,
        })}
      />
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
        body: JSON.stringify({ decrease: true }),
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
      {loading && (
        <div style={{ width: '50px', margin: 'auto' }}>
          <CircularProgressbar value={0} />
        </div>
      )}
      {!loading && (
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
          {employees.map((employee) => (
            <div
              key={employee._id}
              style={{
                width: '200px',
                textAlign: 'center',
                border: '2px solid #313131',
                fontSize: '16px',
                padding: '20px',
                borderRadius: '10px',
                backgroundColor: '#ffffff',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h2 style={{ marginBottom: '15px', fontWeight: 'bold', fontSize: '18px' }}>{employee.name}</h2>
              <AttendanceCircle attendanceCount={employee.attendanceCount} />
              <button
                onClick={() => updateAttendance(employee._id, true)}
                style={{
                  padding: '8px 15px',
                  margin: '5px',
                  cursor: 'pointer',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '14px',
                }}
              >
                Increase
              </button>
              <button
                onClick={() => decreaseAttendance(employee._id)}
                style={{
                  padding: '8px 15px',
                  margin: '5px',
                  cursor: 'pointer',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '14px',
                }}
              >
                Decrease
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard; 