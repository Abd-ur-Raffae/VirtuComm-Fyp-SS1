import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const logoutUser = () => {
    // Clear user session or any other relevant data
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
    console.log("Logging out");

    // Redirect the user to the login page or home page after logout
    navigate('/login');
  };

  return (
    <div className="container-fluid sticky-top">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-dark p-0">
          <Link to="/home" className="navbar-brand">
            <h1 className="text-white">Virtu<span className="text-dark">Comm</span></h1>
          </Link>
          <button
            title="ghar"
            type="button"
            className="navbar-toggler ms-auto me-0"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav ms-auto">
              <Link to="/home" className="nav-item nav-link active">Home</Link>
              <Link to="/about" className="nav-item nav-link">About</Link>
              
              <Link to="/contact" className="nav-item nav-link">Contact</Link>
              <button onClick={logoutUser} className="nav-item nav-button">Sign Out</button>
            </div>
            <button
              type="button"
              className="btn text-white p-0 d-none d-lg-block"
              data-bs-toggle="modal"
              data-bs-target="#searchModal"
            >
              <i className="fa fa-search" />
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
