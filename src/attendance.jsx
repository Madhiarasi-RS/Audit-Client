import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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

  const data = employees.map((employee) => ({
    name: employee.name,
    attendance: employee.attendanceCount,
  }));

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '20px' }}>Employee Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="attendance" fill="#4caf50" />
            </BarChart>
          </ResponsiveContainer>

          <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
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
                <p style={{ fontSize: '20px' }}>
                  {employee.attendanceCount >= 30 ? '✅' : '❌'} {employee.attendanceCount}%
                </p>
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
        </>
      )}
    </div>
  );
};

export default EmployeeDashboard;
