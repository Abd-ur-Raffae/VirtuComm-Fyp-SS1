import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/check-login/', { withCredentials: true });
        setIsAuthenticated(response.data.isAuthenticated);
        setUsername(response.data.username || ''); // Use username from backend
        if (response.data.isAuthenticated) {
          sessionStorage.setItem('user', JSON.stringify({ username: response.data.username }));
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUsername('');
        console.error('Error checking login status:', error);
      }
    };
    checkAuthStatus();
  }, []);

  const logoutUser = async () => {
    try {
      await axios.post('http://localhost:8000/api/logout/', {}, { withCredentials: true });
      console.log("Logged out from backend");
    } catch (error) {
      console.error('Logout error:', error);
    }
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUsername('');
    navigate('/login');
  };

  return (
    <>
      <link href="/img/favicon.ico" rel="icon" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
      <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&family=Ubuntu:wght@500;700&display=swap" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet" />
      <script src="/js/main.js"></script>
      <link href="/lib/animate/animate.min.css" rel="stylesheet" />
      <link href="/lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet" />
      <link href="/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet" />
      <link href="/css/style.css" rel="stylesheet" />
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
      <script src="https://code.jquery.com/jquery-3.6.0.min.js" defer></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" defer></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js" defer></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
      <script src="/lib/wow/wow.min.js"></script>
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
                <Link to="/home" className="nav-item nav-link active mt-2">Home</Link>
                <Link to="/ScenarioSelection" className="nav-item nav-link mt-2">Scenarios</Link>
                <Link to="/about" className="nav-item nav-link mt-2">About</Link>
                <Link to="/contact" className="nav-item nav-link mt-2">Contact</Link>
                {isAuthenticated ? (
                  <>
                    <span className="nav-item nav-link text-white mt-2">Welcome, {username}</span>
                    <button
                      onClick={logoutUser}
                      className="btn btn-primary rounded-pill px-2 mb-2"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="nav-item nav-link mt-2">Register</Link>
                    <Link to="/login" className="nav-item nav-link mt-2">Login</Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;