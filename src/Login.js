import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Login = () => {
    const navigate = useNavigate();
    const handleAdminClick = () => {
      navigate("/AdminLogin");
    };
    const handleEmployeeClick = () => { 
      navigate("/EmployeeLogin"); };
    
  return ( 
    <>
    <Navbar/>
    <div style={styles.container}>
      <div style={styles.card} onClick={handleAdminClick}>
        <h2 style={styles.cardTitle}>AUDITOR</h2>
      </div>
      <div style={styles.card} onClick={handleEmployeeClick}> 
        <h2 style={styles.cardTitle}>EMPLOYEE</h2> 
        </div>
    </div></>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#203A43",
  },
  card: {
    width: "300px",
    height: "200px",
    margin: "20px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    transition: "transform 0.3s ease",
  },
  cardTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
  },
};

export default Login;