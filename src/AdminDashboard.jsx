import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Employ() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDOB] = useState("");
  const [gender, setGender] = useState("");
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState("-1");

  const [taskDetails, setTaskDetails] = useState({});
  const [showTaskForm, setShowTaskForm] = useState({});

  const apiUrl = "http://localhost:5000";
  const navigate = useNavigate();

  const handleSubmit = () => {
    setError("");
    if (name.trim() !== "" && type.trim() !== "") {
      axios
        .post(apiUrl + "/employees", { name, type, email, dob, gender })
        .then((res) => {
          setEmployees([...employees, res.data]);
          setName("");
          setType("");
          setEmail("");
          setDOB("");
          setGender("");
          setMessage("Employee added successfully");
          setTimeout(() => setMessage(""), 3000);
        })
        .catch(() => {
          setError("Unable to create new employee");
        });
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);

  const getEmployees = () => {
    axios
      .get(apiUrl + "/employees")
      .then((res) => {
        setEmployees(res.data);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
        setError("Failed to fetch employees. Please check the server.");
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure want to delete?")) {
      axios
        .delete(apiUrl + "/employees/" + id)
        .then(() => {
          const updatedEmployees = employees.filter(
            (employee) => employee._id !== id
          );
          setEmployees(updatedEmployees);
        })
        .catch(() => {
          setError("Unable to delete employee");
        });
    }
  };

  const handleAssignWork = (id) => {
    setShowTaskForm((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleTaskChange = (id, field, value) => {
    setTaskDetails((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleTaskSubmit = (id) => {
    const taskData = taskDetails[id];
    if (taskData && taskData.task && taskData.description) {
      axios
        .post(`${apiUrl}/employees/${id}/tasks`, taskData)
        .then(() => {
          setMessage("Task assigned successfully");
          setTimeout(() => setMessage(""), 3000);
          setShowTaskForm((prev) => ({ ...prev, [id]: false }));
          setTaskDetails((prev) => ({ ...prev, [id]: { task: "", description: "" } }));
        })
        .catch(() => {
          setError("Unable to assign task");
        });
    } else {
      setError("Please fill in both task and description.");
    }
  };

  const navigateToEmployeePage = () => {
    navigate('/employee');
  };

  return (
    <>
    <Navbar/>
      <div className="row mt-3 justify-content-center">
        <div className="card shadow p-3 mb-3 col-md-6 gradient-bg">
          <h3 className="text-center text-light">Employees</h3>

          <ul className="list-group">
            {employees.map((employee) => (
              <li
                key={employee._id}
                className="list-group-item d-flex flex-column align-items-center my-2 border border-dark text-center shadow"
              >
                <div className="text-dark mb-2">
                  <span className="fw-bold">{employee.name}</span>
                </div>
                <button
                  className="btn btnclr text-light"
                  onClick={() => handleAssignWork(employee._id)}
                >
                  Assign Work
                </button>
                {error && <p className="text-danger text-center">{error}</p>}
      {message && <p className="text-success text-center">{message}</p>}

                {/* Task input form */}
                {showTaskForm[employee._id] && (
                  <div className="mt-3 w-100">
                    <input
                      type="text"
                      placeholder="Task"
                      className="form-control mb-2"
                      value={taskDetails[employee._id]?.task || ""}
                      onChange={(e) => handleTaskChange(employee._id, "task", e.target.value)}
                    />
                    <textarea
                      placeholder="Description"
                      className="form-control mb-2"
                      value={taskDetails[employee._id]?.description || ""}
                      onChange={(e) => handleTaskChange(employee._id, "description", e.target.value)}
                    />
                    <button
                      className="btn btn btnclr text-light"
                      onClick={() => handleTaskSubmit(employee._id)}
                    >
                      Save Task
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button 
        onClick={navigateToEmployeePage} 
        className="btn btnclr text-light d-flex justify-content-center mb-3">
        Add Employee
      </button>
      
    </>
  );
}
