import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

class Index extends Component {
  state = {
    isAuthenticated: true,
    redirectToLogin: false,
    csrfToken: '', // Store the CSRF token here
  };

  componentDidMount() {
    this.checkLoginStatus();
    this.fetchCsrfToken();
  }

  checkLoginStatus = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/check-login/', { withCredentials: true });
      this.setState({ isAuthenticated: response.data.isAuthenticated });
    } catch (error) {
      this.setState({ isAuthenticated: false });
    }
  };

  fetchCsrfToken = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/csrf-token/', { withCredentials: true });
      this.setState({ csrfToken: response.data.csrfToken });
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
    }
  };

  logoutUser = async () => {
    try {
      // Send the logout request to the backend
      const response = await axios.post('http://localhost:8000/api/logout/', {}, {
        headers: {
          'X-CSRFToken': this.state.csrfToken, // Use the CSRF token stored in state
        },
        withCredentials: true, // Include cookies for CSRF validation
      });
  
      console.log(response.data.message); // Optionally log the success message
  
      // Update the authentication state and redirect
      this.setState({ isAuthenticated: false, redirectToLogin: true });
    } catch (error) {
      console.error('Logout error:', error.response?.data?.error || error.message);
    }
  };

    render() {
      if (this.state.redirectToLogin || !this.state.isAuthenticated) {
        return <Navigate to="/login" />;
      }
      return (
        <div>
          <meta charSet="utf-8" />
          <title>VirtuComm</title>
          <meta content="width=device-width, initial-scale=1.0" name="viewport" />
          <meta content name="keywords" />
          <meta content name="description" />

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
          
          {/* Template Stylesheet */}
          <link href="/css/style.css" rel="stylesheet" />

          <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
          <script src="/lib/wow/wow.min.js" ></script>
          <script src="/lib/easing/easing.min.js"></script>
          <script src="/lib/waypoints/waypoints.min.js"></script>
          <script src="/lib/counterup/counterup.min.js"></script>
          <script src="/lib/owlcarousel/owl.carousel.min.js"></script>

          {/* Spinner Start */}
          {/* <div id="spinner" className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
            <div className="spinner-grow text-primary" style={{width: '3rem', height: '3rem'}} role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div> */}
          {/* Spinner End */}

          {/* Navbar Start */}
          <div className="container-fluid sticky-top">
            <div className="container">
              <nav className="navbar navbar-expand-lg navbar-dark p-0">
                <a href="/home" className="navbar-brand">
                  <h1 className="text-white">Virtu<span className="text-dark">Comm</span></h1>
                </a>
                <button title="ghar" type="button" className="navbar-toggler ms-auto me-0" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                  <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                  <div className="navbar-nav ms-auto">
                    <a href="/home" className="nav-item nav-link active">Home</a>
                    <a href="/about" className="nav-item nav-link">About</a>
                    <a href="/projects" className="nav-item nav-link">Projects</a>
                    <a href="/contact" className="nav-item nav-link">Contact</a>
                    <button onClick={this.logoutUser} className="nav-item nav-button">Sign Out</button>

                  </div>
                  <butaton type="button" className="btn text-white p-0 d-none d-lg-block" data-bs-toggle="modal" data-bs-target="#searchModal"><i className="fa fa-search" /></butaton>
                </div>
              </nav>
            </div>
          </div>
          {/* Navbar End */}

          {/* Hero Start */}
          <div className="container-fluid pt-5 bg-primary hero-header mb-5">
            <div className="container pt-5">
              <div className="row g-5 pt-5">
                <div className="col-lg-6 align-self-center text-center text-lg-start mb-lg-5">
                  <h1 className="display-4 text-white mb-4 animated slideInRight">Exploring Dialogue Dynamics Between AIs</h1>
                  <p className="text-white mb-4 animated slideInRight">An innovative exploration of dialogue dynamics,
                    showcasing a conversation between two AIs as they navigate complex topics and share perspectives.</p>
                  <a href className="btn btn-light py-sm-3 px-sm-5 rounded-pill me-3 animated slideInRight">Read More</a>
                  <a href="/contact" className="btn btn-outline-light py-sm-3 px-sm-5 rounded-pill animated slideInRight">Contact Us</a>
                </div>
                <div className="col-lg-6 align-self-end text-center text-lg-end">
                  <img className="img-fluid" src="/img/headerback.png" alt="" />
                </div>
              </div>
            </div>
          </div>
          {/* Hero End */}

          {/* Full Screen Search Start */}
          <div className="modal fade" id="searchModal" tabIndex={-1}>
            <div className="modal-dialog modal-fullscreen">
              <div className="modal-content" style={{background: 'rgba(20, 24, 62, 0.7)'}}>
                <div className="modal-header border-0">
                  <button type="button" className="btn btn-square bg-white btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div className="modal-body d-flex align-items-center justify-content-center">
                  <div className="input-group" style={{maxWidth: '600px'}}>
                    <input type="text" className="form-control bg-transparent border-light p-3" placeholder="Type search keyword" />
                    <button title="search" className="btn btn-light px-4"><i className="bi bi-search" /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Full Screen Search End */}

          {/* Case Start */}
          <div className="container-fluid bg-light py-5">
            <div className="container py-5">
              <div className="mx-auto text-center wow fadeIn" data-wow-delay="0.1s" style={{maxWidth: '500px'}}>
                <div className="btn btn-sm border rounded-pill text-primary px-3 mb-3">Workings</div>
                <h1 className="mb-4">Our Recent Project working</h1>
              </div>
              <div className="row g-4">
                <div className="col-lg-2 wow fadeIn" data-wow-delay="0.3s">
                  <div className="case-item position-relative overflow-hidden rounded mb-2">
                  </div>
                </div>
                <div className="col-lg-8 wow fadeIn" data-wow-delay="0.5s">
                  <div className="case-item position-relative overflow-hidden rounded mb-2">
                    <img className="img-fluid" src="/img/banda.png" alt="" />
                    <a className="case-overlay text-decoration-none" href>
                      <small>Phase 1.1</small>
                      <h5 className="lh-base text-white mb-3">Basic AI 3D Model 
                      </h5>
                      <a className="btn btn-square btn-primary" href='/projects'><i className="fa fa-arrow-right" /></a>
                    </a>
                  </div>
                </div>
                <div className="col-lg-2 wow fadeIn" data-wow-delay="0.7s">
                  <div className="case-item position-relative overflow-hidden rounded mb-2">
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Case End */} 

          {/* Footer Start */}
<div className="container-fluid bg-dark text-white-50 footer pt-5">
  <div className="container py-5">
    <div className="row g-5">
      {/* VirtuComm Section */}
      <div className="col-md-6 col-lg-6 wow fadeIn" data-wow-delay="0.1s">
        <a href="/home" className="d-inline-block mb-3">
          <h1 className="text-white">Virtu<span className="text-primary">Comm</span></h1>
        </a>
        <p className="mb-0">AI isn’t just shaping the future—it’s redefining how we communicate, learn, and grow. Through innovative applications like AI-driven communication training, we can address one of the most fundamental barriers to human potential.</p>
      </div>
      
      {/* Get In Touch Section */}
      <div className="col-md-6 col-lg-6 text-end wow fadeIn" data-wow-delay="0.3s">
        <h5 className="text-white mb-4">Get In Touch</h5>
        <p><i className="fa fa-map-marker-alt me-3" />123 ghar, Sargodha, Pakistan</p>
        <p><i className="fa fa-phone-alt me-3" />+012 345 67890</p>
        <p><i className="fa fa-envelope me-3" />info@example.com</p>
        <div className="d-flex justify-content-end pt-2">
          <a className="btn btn-outline-light btn-social" href="#"><i className="fab fa-twitter" /></a>
          <a className="btn btn-outline-light btn-social" href="#"><i className="fab fa-facebook-f" /></a>
          <a className="btn btn-outline-light btn-social" href="#"><i className="fab fa-youtube" /></a>
          <a className="btn btn-outline-light btn-social" href="#"><i className="fab fa-instagram" /></a>
          <a className="btn btn-outline-light btn-social" href="#"><i className="fab fa-linkedin-in" /></a>
        </div>
      </div>
    </div>
  </div>
  <div className="container wow fadeIn" data-wow-delay="0.1s">
    <div className="copyright">
      <div className="row">
        <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
          © <a className="border-bottom" href="#">VirtuComm</a>, All Rights Reserved.
          Designed By <a className="border-bottom" href="#">Us</a> Distributed By <a className="border-bottom" href="">Our hosting site</a>
        </div>
        <div className="col-md-6 text-center text-md-end">
          <div className="footer-menu">
            <a href="#">Home</a>
            <a href="#">Help</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
{/* Footer End */}


          {/* Back to Top */}
          <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top pt-2"><i className="bi bi-arrow-up" /></a>
        </div>
      );
    }
  } ;

export default Index;