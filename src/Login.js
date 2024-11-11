import React from "react";
import { useNavigate } from "react-router-dom";
import logo from './assets/logo.png';
import backgroundImage from './assets/login.jpg';

const Login = () => {
  const navigate = useNavigate();

  const handleAdminClick = () => {
    navigate("/AdminLogin");
  };

  const handleEmployeeClick = () => {
    navigate("/EmployeeLogin");
  };

  const handleLoginClick = () => {
    navigate('/'); // Navigates to Login.jsx page
  };

  return (
    <>
      <nav style={styles.navbar}>
        {/* Logo and Title */}
        <div style={styles.leftContainer}>
          <img src={logo} alt="Logo" style={styles.logo} />
          <h1 style={styles.title}>Audit Governance Platform</h1>
        </div>

        {/* Login Button */}
        <div style={styles.rightContainer}>
          <button onClick={handleLoginClick} style={styles.loginButton}>
            Back
          </button>
        </div>
      </nav>

      <div style={styles.container}>
        <div
          style={styles.card}
          onClick={handleAdminClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
          }}
        >
          <h2 style={styles.cardTitle}>AUDITOR</h2>
        </div>

        <div
          style={styles.card}
          onClick={handleEmployeeClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
          }}
        >
          <h2 style={styles.cardTitle}>EMPLOYEE</h2>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    backgroundColor: "#203A43",
  },
  card: {
    width: "300px",
    height: "200px",
    margin: "20px",
    backgroundColor: " #2a29296f",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    transition: 'transform 0.2s, boxShadow 0.2s',
    backdropFilter: 'blur(8px)', // Apply blur effect
  },
  cardTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#fff",
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#001f3f',
    color: '#ffffff',
  },
  leftContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    height: '40px', // Adjust as needed
    marginRight: '10px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  rightContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  loginButton: {
    padding: '8px 16px',
    backgroundColor: '#333', // Blue button color
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default Login;
