import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Img from './assets/a.jpg';

const EmployeeWork = () => {
  const [tasks, setTasks] = useState(
    Array(8).fill(null).map(() => ({ task: "", proof: null, uploadedAt: null }))
  );
  const [attendanceIndicator, setAttendanceIndicator] = useState("red");
  const [employeeTasks, setEmployeeTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const apiUrl = "http://localhost:8000"; // Define apiUrl or use your API base URL

  // Fetch tasks from database
  const fetchTasksFromDatabase = async () => {
    try {
      const response = await axios.get(`${apiUrl}/tasks`);
      setEmployeeTasks(response.data); // Assuming response contains an array of tasks
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      alert("Failed to fetch tasks");
    }
  };

  // Load tasks from the database when the component mounts
  useEffect(() => {
    fetchTasksFromDatabase();
  }, []);

  // Update the current date and time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTaskChange = (index, task) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], task, uploadedAt: new Date() };
    setTasks(newTasks);
  };

  const handleFileChange = (index, file) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], proof: file, uploadedAt: new Date() };
    setTasks(newTasks);
  };

  const handleSubmit = () => {
    const allTasksCompleted = tasks.every((task) => task.task !== "" && task.proof !== null);

    if (allTasksCompleted) {
      setAttendanceIndicator("green");
      alert("Tasks submitted successfully!");
    } else {
      setAttendanceIndicator("red");
      alert("Please complete all tasks for each hour and upload proof.");
    }
  };

  const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;

  return (
    <>
      <Navbar />
      <div style={styles.pageBackground}>
        <div style={styles.container}>
          <h1>Audit Personnel Work Submission</h1>
          <div style={styles.dateTime}>
            <p>Current Date and Time: {formattedDate}</p>
          </div>

          <div style={styles.assignedTasks}>
            <h2>Assigned Tasks</h2>
            {employeeTasks.length > 0 ? (
              employeeTasks.map((task) => (
                <li key={task._id} className="list-group-item">
                  <span className="fw-bold">{task.title}</span>: {task.description}
                </li>
              ))
            ) : (
              <p>No tasks assigned.</p>
            )}
          </div>

          <div style={styles.taskContainer}>
            {tasks.map((taskObj, index) => (
              <div key={index} style={styles.taskRow}>
                <label>Hour {index + 1}</label>
                <input
                  type="text"
                  placeholder={`Task for Hour ${index + 1}`}
                  value={taskObj.task}
                  onChange={(e) => handleTaskChange(index, e.target.value)}
                  style={styles.input}
                />
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf,.docx,.xlsx"
                  onChange={(e) => handleFileChange(index, e.target.files[0])}
                  style={styles.fileInput}
                />
                {taskObj.uploadedAt && (
                  <span style={styles.uploadTime}>
                    Uploaded at: {taskObj.uploadedAt.toLocaleTimeString()}
                  </span>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            style={styles.submitButton}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = styles.submitButtonHover.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = styles.submitButton.backgroundColor)
            }
          >
            Submit
          </button>

          <div style={styles.attendanceContainer}>
            <p>Attendance Indicator:</p>
            <div
              style={{
                ...styles.attendanceIndicator,
                backgroundColor: attendanceIndicator === "darkgreen" ? "darkgreen" : "darkred",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

// Styles
const styles = {
  pageBackground: {
    backgroundImage: `url(${Img})`, // Use the imported image here
    backgroundSize: 'cover', 
   backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  container: {
    padding: "20px",
    maxWidth: "800px",
    width: "100%",
    textAlign: "center",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  dateTime: {
    marginBottom: "20px",
    fontSize: "16px",
    color: "#333",
    fontWeight: "500",
  },
  assignedTasks: {
    margin: "20px 0",
    textAlign: "left",
    backgroundColor: "#536976",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  taskContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
  },
  taskRow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    padding: "10px",
    backgroundColor: "#16222a",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    color:"#fff",
  },
  input: {
    width: "90%",
    padding: "8px",
    margin: "5px 0",
    border: "1px solid #ccc",
    borderRadius: "4px",
    outline: "none",
  },
  fileInput: {
    margin: "10px 0",
  },
  uploadTime: {
    fontSize: "12px",
    color: "#777",
    marginTop: "5px",
  },
  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
    transition: "background-color 0.3s",
  },
  submitButtonHover: {
    backgroundColor: "#0056b3",
  },
  attendanceContainer: {
    marginTop: "20px",
    textAlign: "center",
  },
  attendanceIndicator: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    margin: "0 auto",
    border: "3px solid #ddd",
  },
};

export default EmployeeWork;
