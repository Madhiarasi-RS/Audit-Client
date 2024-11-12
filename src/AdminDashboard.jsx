import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import auditImage from "../src/assets/audit.jpg";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function Employ() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [employeeTasks, setEmployeeTasks] = useState({});

  const apiUrl = "http://localhost:8000";
  const navigate = useNavigate();

  // Assign work to a specific employee
  const handleAssignWork = (employeeId) => {
    setError("");
    if (title.trim() && description.trim()) {
      fetch(`${apiUrl}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, employeeId }), // Include employee ID
      })
        .then((res) => res.json())
        .then((newTask) => {
          // Update the employee's task list with the new task
          setEmployeeTasks((prev) => ({
            ...prev,
            [employeeId]: prev[employeeId] ? [...prev[employeeId], newTask] : [newTask],
          }));
          setTitle("");
          setDescription("");
          alert("Task added successfully");

         // Clear the message after 3 seconds
          setTimeout(() => setMessage(""), 3000);
        })
        .catch(() => setError("Unable to create Task. Please try again later."));
    } else {
      const errorMessage = "Both title and description are required.";
      alert(errorMessage);
    }
  };
  useEffect(() => {
    // Check if tasks are saved in localStorage
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setEmployeeTasks(JSON.parse(storedTasks));
    } else {
      getTasks();
    }
    getEmployees();
  }, []);
  
  // Whenever employeeTasks is updated, save it to localStorage
  useEffect(() => {
    if (Object.keys(employeeTasks).length > 0) {
      localStorage.setItem('tasks', JSON.stringify(employeeTasks));
    }
  }, [employeeTasks]);
  

  const getTasks = () => {
    fetch(`${apiUrl}/tasks`)
      .then((res) => res.json())
      .then((data) => {
        const groupedTasks = data.reduce((acc, task) => {
          const { employeeId } = task;
          if (!acc[employeeId]) acc[employeeId] = [];
          acc[employeeId].push(task);
          return acc;
        }, {});
        setEmployeeTasks(groupedTasks);
      })
      .catch(() => alert("Failed to fetch tasks"));
  };
  const getEmployees = () => {
    fetch(`${apiUrl}/employees`)
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch(() => alert("Failed to fetch employees"));
  };

  // Handle task edit
  const handleEdit = (task) => {
    setEditId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  // Handle task update
  const handleUpdate = (employeeId) => {
    setError("");
    if (editTitle.trim() && editDescription.trim()) {
      fetch(apiUrl + "/tasks/" + editId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      })
        .then((res) => {
          if (res.ok) {
            // Update the employee's task list with the updated task
            const updatedTasks = employeeTasks[employeeId].map((task) =>
              task._id === editId
                ? { ...task, title: editTitle, description: editDescription }
                : task
            );
            setEmployeeTasks((prev) => ({
              ...prev,
              [employeeId]: updatedTasks,
            }));
            setEditId(null);
            alert("Task updated successfully");
            setTimeout(() => setMessage(""), 3000);
          } else {
            alert("Unable to update Task. Please try again later.");
          }
        })
        .catch(() => alert("Unable to update task"));
    } else {
      alert(setError("Both title and description are required for update."));
    }
  };

  // Cancel task edit
  const handleEditCancel = () => {
    setEditId(null);
  };

  // Handle task delete
  const handleDelete = (employeeId, taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      fetch(`${apiUrl}/tasks/${taskId}`, { method: "DELETE" })
        .then(() => {
          // Remove the task from the employee's task list
          setEmployeeTasks((prev) => ({
            ...prev,
            [employeeId]: prev[employeeId].filter((task) => task._id !== taskId),
          }));
          alert("Task deleted successfully");
          setTimeout(() => setMessage(""), 3000);
        })
        .catch(() => alert("Unable to delete task"));
    }
  };

  const navigateToEmployeePage = () => {
    navigate("/employee");
  };
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
    <>
      <Navbar />
    <div 
      className="container mt-0" 
      style={{ 
        backgroundImage: `url(${auditImage})`, // Use the imported image here
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed', 
        padding: "20px", 
        top: 0,
        left: 0,
        minHeight: '100vh', // Ensures the container takes the full viewport height
        maxWidth: '100%', // Ensures the container takes the full viewport width
        borderRadius: "0px", 
      }}
    >
      <h1 style={{ color: 'white', fontWeight: 'bold', fontSize: '3rem' }}>Audit Personnel Dashboard</h1>
       <div
        style={{
          width: '50%',
          height: '50%',
          display: 'flex',
          marginLeft: '350px',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backdropFilter: 'blur(8px)', // Apply blur effect
          borderRadius: '8px',
          padding: '20px', // Optional padding for inner content
        }}
      >
      <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '2rem', color: 'white' }}>Attendance Dashboard</h1>
      {loading && (
        <div style={{ width: '100px', margin: 'auto' }}>
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
      <h3 style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '2rem', color: 'white' }}>Audit Personnel</h3>
          <ul className="list-group">
            {employees.map((employee) => (
              <li
              key={employee._id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
                margin: '10px 0',
                border: '2px solid #343a40', // Dark border color
                borderRadius: '8px', // Rounded corners
                backgroundColor: ' #8d9290', // Light background color
                textAlign: 'center',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow
                transition: 'transform 0.2s, boxShadow 0.2s', // Smooth transition for hover
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
              }}
            >
              <span style={{ color: 'white', fontWeight: '600', marginBottom: '5px', fontSize: '1.5rem' }}>
                {employee.name}
              </span>
              <input
  placeholder="Title"
  onChange={(e) => setTitle(e.target.value)}
  value={title}
  type="text"
  style={{
    width: '100%',
    padding: '10px',
    marginBottom: '10px', // Space between inputs
    border: '1px solid #ced4da', // Light border color
    borderRadius: '5px', // Rounded corners
    outline: 'none',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow
    fontSize: '16px', // Larger font for readability
  }}
/>

<input
  placeholder="Description"
  onChange={(e) => setDescription(e.target.value)}
  value={description}
  type="text"
  style={{
    width: '100%',
    padding: '10px',
    marginBottom: '10px', // Space below input
    border: '1px solid #ced4da',
    borderRadius: '5px',
    outline: 'none',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    fontSize: '16px',
  }}
/>

<br />

<button
  onClick={() => handleAssignWork(employee._id)} // Assign work to this employee
  style={{
    width: '100%',
    padding: '10px',
    backgroundColor: 'black', // Primary color
    color: 'white', // White text color
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)', // Button shadow
    transition: 'background-color 0.3s', // Smooth hover transition
  }}
  onMouseEnter={(e) => (e.target.style.backgroundColor = '#351616a2')} // Darker shade on hover
  onMouseLeave={(e) => (e.target.style.backgroundColor = 'black')}
>
  Assign Work
</button>
<br></br>
                <h4 className="text-dark">Assigned Tasks</h4>
                <br></br>
                <ul className="list-group">
                  {employeeTasks[employee._id]?.map((task) => (
                    <li key={task._id} className="list-group-item">
                      {editId !== task._id ? (
                        <>
                          <span className="fw-bold">{task.title}</span>: {task.description}
                          <button
  onClick={() => handleEdit(task)}
  style={{
    backgroundColor: 'rgb(12, 40, 51)', // Warning color for edit
    color: '#fff', // White text
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    marginLeft: '10px', // Spacing between buttons
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow
    transition: 'background-color 0.3s', // Smooth hover transition
  }}
  onMouseEnter={(e) => (e.target.style.backgroundColor = 'Black')} // Darker shade on hover
  onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgb(12, 40, 51)')}
>
  Edit
</button>

<button
  onClick={() => handleDelete(employee._id, task._id)}
  style={{
    backgroundColor: 'rgb(12, 40, 51)', // Danger color for delete
    color: '#fff', // White text
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    marginLeft: '10px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s',
  }}
  onMouseEnter={(e) => (e.target.style.backgroundColor = 'Black')} // Darker shade on hover
  onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgb(12, 40, 51)')}
>
  Delete
</button>
                        </>
                      ) : (
                        <div
                        style={{
                          display: 'flex',
                          gap: '8px', // Space between elements
                          alignItems: 'center',
                          padding: '10px',
                          borderRadius: '8px',
                          backgroundColor: '#626363', // Light background for the edit section
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow
                        }}
                      >
                        <input
                          placeholder="Title"
                          onChange={(e) => setEditTitle(e.target.value)}
                          value={editTitle}
                          style={{
                            flex: 1,
                            padding: '8px',
                            border: '2px solid black', // Light border
                            borderRadius: '4px',
                            fontSize: '14px',
                          }}
                          type="text"
                        />
                        <input
                          placeholder="Description"
                          onChange={(e) => setEditDescription(e.target.value)}
                          value={editDescription}
                          style={{
                            flex: 1,
                            padding: '8px',
                            border: '2px solid black',
                            borderRadius: '4px',
                            fontSize: '14px',
                          }}
                          type="text"
                        />
                        <button
                          onClick={() => handleUpdate(employee._id)}
                          style={{
                            backgroundColor: 'rgb(6, 67, 92)', // Yellow for "Update" button
                            color: '#fff',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            transition: 'background-color 0.3s',
                          }}
                          onMouseEnter={(e) => (e.target.style.backgroundColor = 'Black')} // Darker shade on hover
                          onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgb(6, 67, 92)')}
                        >
                          Update
                        </button>
                        <button
                          onClick={handleEditCancel}
                          style={{
                            backgroundColor: 'rgb(6, 67, 92)', // Red for "Cancel" button
                            color: '#fff',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            transition: 'background-color 0.3s',
                          }}
                          onMouseEnter={(e) => (e.target.style.backgroundColor = 'Black')} // Darker shade on hover
                          onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgb(6, 67, 92)')}
                        >
                          Cancel
                        </button>
                      </div>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        <div className="container mt-3">
          {error && <p className="text-danger text-center">{error}</p>}
          {message && <p className="text-success text-center">{message}</p>}
        </div>
        <button
       onClick={navigateToEmployeePage}

    style={{
    position: 'absolute',
    top: '80px',  // Adjust based on your navbar height
    left: '87%',
    transform: 'translateX(-50%)',  // Centers the button horizontally
    zIndex: 10,
    padding: '10px 20px',  // Adds padding to the button
    backgroundColor: 'black',  // Button color
    color: 'white',  // Text color
    border: 'none',
    borderRadius: '4px',  // Rounded corners
    fontSize: '16px',  // Font size
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',  // Smooth background color change on hover
  }}
  onMouseOver={(e) => (e.target.style.backgroundColor = 'rgb(6, 67, 92)')} // Darkens color on hover
  onMouseOut={(e) => (e.target.style.backgroundColor = 'black')}  // Resets color on mouse out
>
  Add Audit Personnel
</button>
      </div>
    </>
  );
}
