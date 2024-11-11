import React, { useState, useEffect } from "react";
import axios from "axios"; // assuming axios is used for API requests
import Navbar from "./Navbar";

const EmployeeWork = () => {
  // State for storing tasks, proof, and upload time for each hour
  const [tasks, setTasks] = useState(
    Array(8).fill(null).map(() => ({ task: "", proof: null, uploadedAt: null }))
  );
  const [assignedTasks, setAssignedTasks] = useState([]); // State for assigned tasks from adminDashboard
  const [attendanceIndicator, setAttendanceIndicator] = useState("red"); // Red for incomplete, green for complete

  // State for the current date
  const [currentDate, setCurrentDate] = useState(new Date());

  // Fetch assigned tasks from adminDashboard
  useEffect(() => {
    const fetchAssignedTasks = async () => {
      try {
        const response = await axios.get('/api/adminDashboard/assignedTasks'); // Adjust URL as needed
        setAssignedTasks(response.data);
      } catch (error) {
        console.error("Error fetching assigned tasks:", error);
      }
    };

    fetchAssignedTasks();
  }, []);

  // Update the current date and time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  // Handle input change for tasks and record upload time
  const handleTaskChange = (index, task) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], task, uploadedAt: new Date() };
    setTasks(newTasks);
  };

  // Handle file upload for proof and record upload time
  const handleFileChange = (index, file) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], proof: file, uploadedAt: new Date() };
    setTasks(newTasks);
  };

  // Handle submission
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

  // Format the current date and time
  const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;

  // Get the real-time hour for the label (Hour 1 starts at the current hour, Hour 2 is +1, etc.)
  const getHourLabel = (hourIndex) => {
    const currentHour = currentDate.getHours();
    const labelHour = (currentHour + hourIndex) % 24; // Handle 24-hour wrap-around
    return labelHour;
  };

  return (
    <> <Navbar />
    <div style={styles.pageBackground}>
      <div style={styles.container}>
        <h1>Audit Personnel Work Submission</h1>

        {/* Display the current date and time */}
        <div style={styles.dateTime}>
          <p>Current Date and Time: {formattedDate}</p>
        </div>

        {/* Display assigned tasks */}
        <div style={styles.assignedTasks}>
          <h2>Assigned Tasks</h2>
          {assignedTasks.length > 0 ? (
            assignedTasks.map((task, index) => (
              <div key={index} style={styles.taskItem}>
                <p><strong>Task {index + 1}:</strong> {task.description}</p>
              </div>
            ))
          ) : (
            <p>No tasks assigned.</p>
          )}
        </div>

        {/* Task inputs for each hour */}
        <div style={styles.taskContainer}>
          {tasks.map((taskObj, index) => (
            <div key={index} style={styles.taskRow}>
              <label>
                Hour {index + 1} ({getHourLabel(index)}:00):
              </label>
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

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          style={styles.submitButton}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.submitButtonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.submitButton.backgroundColor)}
        >
          Submit
        </button>

        {/* Attendance Indicator */}
        <div style={styles.attendanceContainer}>
          <p>Attendance Indicator:</p>
          <div
            style={{
              ...styles.attendanceIndicator,
              backgroundColor: attendanceIndicator === "green" ? "green" : "red",
            }}
          />
        </div>
      </div>
    </div></>
  );
};

// Styles
const styles = {
  pageBackground: {
    backgroundColor: "#FFF0F5",
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
    backgroundColor: "#e6f0ff",
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
    backgroundColor: "#f9f9f9",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  taskItem: {
    padding: "5px 0",
    borderBottom: "1px solid #ddd",
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
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
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
    backgroundColor: "#007bff",
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
