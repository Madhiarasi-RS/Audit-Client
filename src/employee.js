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

  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editDob, setEditDOB] = useState("");
  const [editGender, setEditGender] = useState("");

  const apiUrl = "http://localhost:5000";
  const navigate = useNavigate();

  const handleSubmit = () => {
    setError("");
    if (name.trim() !== "" && type.trim() !== "") {
      axios
        .post(apiUrl + "/employees", {
          name,
          type,
          email,
          dob,
          gender,
        })
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

  const handleEdit = (employee) => {
    setEditId(employee._id);
    setEditName(employee.name);
    setEditType(employee.type);
    setEditEmail(employee.email);
    setEditDOB(employee.dob.split("T")[0]);
    setEditGender(employee.gender);
  };

  const handleUpdate = () => {
    setError("");
    if (
      editName.trim() !== "" &&
      editType.trim() !== "" &&
      editEmail.trim() !== "" &&
      editDob.trim() !== "" &&
      editGender.trim() !== ""
    ) {
      axios
        .put(apiUrl + "/employees/" + editId, {
          name: editName,
          type: editType,
          email: editEmail,
          dob: editDob,
          gender: editGender,
        })
        .then((res) => {
          const updatedEmployees = employees.map((employee) =>
            employee._id === editId ? res.data : employee
          );
          setEmployees(updatedEmployees);
          setEditId("-1");
          setEditName("");
          setEditType("");
          setEditEmail("");
          setEditDOB("");
          setEditGender("");
          setMessage("Employee updated successfully");
          setTimeout(() => setMessage(""), 3000);
        })
        .catch(() => {
          setError("Unable to update employee");
        });
    }
  };

  const handleEditCancel = () => {
    setEditId("-1");
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
    navigate(`/AdminDashboard`, { state: { employeeId: id } });
  };

  return (
    <>
    <Navbar/>
      <div className="row mt-3">
        <div className="card gradient-bg shadow p-3 mb-3 ">
          <h3 className="text-light">Add Employee</h3>
          {message && <p className="text-light">{message}</p>}
          <div className="form-group d-flex gap-2 ">
            <input
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="form-control border-dark"
              type="text"
            />
            <input
              placeholder="Job Title"
              onChange={(e) => setType(e.target.value)}
              value={type}
              className="form-control border-dark"
              type="text"
            />
            <input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="form-control border-dark"
              type="email"
            />
            <input
              placeholder="DOB"
              onChange={(e) => setDOB(e.target.value)}
              value={dob}
              className="form-control border-dark"
              type="date"
            />
            <input
              placeholder="Gender"
              onChange={(e) => setGender(e.target.value)}
              value={gender}
              className="form-control border-dark"
              type="text"
            />
            <button className="btn btnclr text-light" onClick={handleSubmit}>
              Submit
            </button>
          </div>
          {error && <p className="text-danger">{error}</p>}
        </div>
      </div>
      <div className="row mt-3 justify-content-center ">
        <div className="card shadow p-3 mb-3 col-md-6 gradient-bg">
          <h3 className="text-center text-light">Employees</h3>
          <ul className="list-group">
            {employees.map((employee) => (
              <li
                key={employee._id}
                className="list-group-item d-flex justify-content-between align-items-center my-2 border border-dark text-center shadow"
              >
                <div className="d-flex flex-column me-2 text-dark">
                  {editId === "-1" || editId !== employee._id ? (
                    <>
                      <span className="fw-bold">{employee.name}</span>
                      <span>{employee.type}</span>
                      <span>{employee.email}</span>
                      <span>{employee.dob.split("T")[0]}</span>
                      <span>{employee.gender}</span>
                    </>
                  ) : (
                    <>
                      <input
                        className="form-control mb-2"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                      <input
                        className="form-control mb-2"
                        value={editType}
                        onChange={(e) => setEditType(e.target.value)}
                      />
                      <input
                        className="form-control mb-2"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                      />
                      <input
                        className="form-control mb-2"
                        type="date"
                        value={editDob}
                        onChange={(e) => setEditDOB(e.target.value)}
                      />
                      <input
                        className="form-control mb-2"
                        value={editGender}
                        onChange={(e) => setEditGender(e.target.value)}
                      />
                    </>
                  )}
                </div>
                <div>
                  {editId === "-1" || editId !== employee._id ? (
                    <>
                      <button
                        className="btn btnclr mx-1 text-light"
                        onClick={() => handleEdit(employee)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btnclr text-light"
                        onClick={() => handleDelete(employee._id)}
                      >
                        Delete
                      </button>
                      
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-secondary mx-1"
                        onClick={handleUpdate}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={handleEditCancel}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}