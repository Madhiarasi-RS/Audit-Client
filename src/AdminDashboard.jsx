import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Employ() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
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
          setMessage("Task added successfully");
          setTimeout(() => setMessage(""), 3000);
        })
        .catch(() => setError("Unable to create Task. Please try again later."));
    } else {
      setError("Both title and description are required.");
    }
  };

  useEffect(() => {
    getTasks();
    getEmployees();
  }, []);

  const getTasks = () => {
    fetch(`${apiUrl}/tasks`)
      .then((res) => res.json())
      .then((data) => {
        // Group tasks by employeeId
        const groupedTasks = data.reduce((acc, task) => {
          const { employeeId } = task;
          if (!acc[employeeId]) acc[employeeId] = [];
          acc[employeeId].push(task);
          return acc;
        }, {});
        setEmployeeTasks(groupedTasks);
      })
      .catch(() => setError("Failed to fetch tasks"));
  };

  const getEmployees = () => {
    fetch(`${apiUrl}/employees`)
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch(() => setError("Failed to fetch employees"));
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
            setMessage("Task updated successfully");
            setTimeout(() => setMessage(""), 3000);
          } else {
            setError("Unable to update Task. Please try again later.");
          }
        })
        .catch(() => setError("Unable to update task"));
    } else {
      setError("Both title and description are required for update.");
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
          setMessage("Task deleted successfully");
          setTimeout(() => setMessage(""), 3000);
        })
        .catch(() => setError("Unable to delete task"));
    }
  };

  const navigateToEmployeePage = () => {
    navigate("/employee");
  };

  return (
    <>
      <Navbar />
      <div className="container mt-3">
        <div className="card shadow p-3 mb-3 col-md-6 mx-auto gradient-bg">
          <h3 className="text-center text-light">Employees</h3>
          <ul className="list-group">
            {employees.map((employee) => (
              <li
                key={employee._id}
                className="list-group-item d-flex flex-column align-items-center my-2 border border-dark text-center shadow"
              >
                <span className="fw-bold text-dark mb-2">{employee.name}</span>
                <input
                  placeholder="Title"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  className="form-control"
                  type="text"
                />
                <input
                  placeholder="Description"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  className="form-control"
                  type="text"
                />
                <button
                  className="btn btnclr text-light mb-2"
                  onClick={() => handleAssignWork(employee._id)} // Assign work to this employee
                >
                  Assign Work
                </button>
                <h4 className="text-dark">Assigned Tasks</h4>
                
                <ul className="list-group">
                  {employeeTasks[employee._id]?.map((task) => (
                    <li key={task._id} className="list-group-item">
                      {editId !== task._id ? (
                        <>
                          <span className="fw-bold">{task.title}</span>: {task.description}
                        
                          <button
                            className="btn btn-warning ms-2"
                            onClick={() => handleEdit(task)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger ms-2"
                            onClick={() => handleDelete(employee._id, task._id)}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <div className="form-group d-flex gap-2">
                          <input
                            placeholder="Title"
                            onChange={(e) => setEditTitle(e.target.value)}
                            value={editTitle}
                            className="form-control"
                            type="text"
                          />
                          <input
                            placeholder="Description"
                            onChange={(e) => setEditDescription(e.target.value)}
                            value={editDescription}
                            className="form-control"
                            type="text"
                          />
                          <button
                            className="btn btn-warning"
                            onClick={() => handleUpdate(employee._id)}
                          >
                            Update
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={handleEditCancel}
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
          className="btn btnclr text-light d-flex justify-content-center mx-auto mb-3"
        >
          Add Employee
        </button>
      </div>
    </>
  );
}
