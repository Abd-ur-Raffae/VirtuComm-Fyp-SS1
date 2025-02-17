import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import 'swiper/css';
import MySwiper from './swiper';
import Navbar from './navbar';
import Footer from './footer';


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

          {/* Spinner Start */}
          {/* <div id="spinner" className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
            <div className="spinner-grow text-primary" style={{width: '3rem', height: '3rem'}} role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div> */}
          {/* Spinner End */}

  
       <Navbar />

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
                <MySwiper />
               
              </div>
            </div>
          </div>
          {/* Case End */} 

          <Footer />

          {/* Back to Top */}
          <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top pt-2"><i className="bi bi-arrow-up" /></a>
        </div>
      );
    }
  } ;

export default Index;