import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo.png';
import logos from './assets/logo.png'; // Replace with the actual path to your logo image
import backgroundImage from './assets/home.jpg'; // Path to your background image

function HomePage() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/Login'); // Navigate to the /Login route
  };

  // Styles
  const styles = {
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      backgroundColor: '#001f3f', // Navy blue color
      color: '#ffffff',
    },
    leftContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    logo: {
      height: '40px',
      marginRight: '10px',
      cursor: 'pointer', // Makes logo clickable
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#ffffff',
    },
    rightContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    loginButton: {
      padding: '8px 16px',
      backgroundColor: '#007bff',
      color: '#ffffff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
    },
    homeContainer: {
      display: 'flex',
   
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundImage: `url(${backgroundImage})`, // Set background image
      backgroundSize: 'cover', // Ensures the image covers the full container
      backgroundPosition: 'center', // Centers the background image
      backgroundAttachment: 'fixed', // Optional: Keeps background fixed while scrolling
      textAlign: 'center',
      color: '#fff', // Make sure text is visible over background
    },
    slogan: {
      fontSize: '2rem',
      color: '#fff',
      margin: 0,
    },
    logos: {
      width: '300px',
      height: '150px',
      marginBottom: '20px',
      cursor: 'pointer', // Makes company logo clickable
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.leftContainer}>
          <img src={logo} alt="Logo" onClick={handleLogoClick} style={styles.logo} />
          <h1 style={styles.title}>Audit Governance Platform</h1>
        </div>
      </nav>

      {/* Home Page Content */}
      <div style={styles.homeContainer}>
        <img 
          src={logos} 
          alt="Company" 
          onClick={handleLogoClick} 
          style={styles.logos} 
        />
        <h1 style={styles.slogan}>"Welcome to Audit - We tick all the right boxes!"</h1>
      </div>
    </>
  );
}

export default HomePage;
