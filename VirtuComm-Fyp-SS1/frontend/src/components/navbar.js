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
    <>
    {/* Favicon */}
    <link href="/img/favicon.ico" rel="icon" />

{/* Google Web Fonts */}
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&family=Ubuntu:wght@500;700&display=swap" rel="stylesheet" />

{/* Icon Font Stylesheet */}
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet" />
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet" />

<script src="/js/main.js"></script>

{/* Libraries Stylesheet */}
<link href="/lib/animate/animate.min.css" rel="stylesheet" />
<link href="/lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet" />

{/* Customized Bootstrap Stylesheet */}
<link href="/css/bootstrap.min.css" rel="stylesheet" />
<link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet" />

{/* Template Stylesheet */}
<link href="/css/style.css" rel="stylesheet" />

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
<script src="https://code.jquery.com/jquery-3.6.0.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="/lib/wow/wow.min.js" ></script>
<script src="/lib/easing/easing.min.js"></script>
<script src="/lib/waypoints/waypoints.min.js"></script>
<script src="/lib/counterup/counterup.min.js"></script>
<script src="/lib/owlcarousel/owl.carousel.min.js"></script>
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
    </>
  );
};

export default Navbar;
