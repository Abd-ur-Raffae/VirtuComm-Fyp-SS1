import React, { Component } from 'react';
import Navbar from './navbar';


class About extends Component{
    render() {
      return (
        <div>
          <meta charSet="utf-8" />
          <title>About Us</title>
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
          
          {/* Libraries Stylesheet */}
          <link href="/lib/animate/animate.min.css" rel="stylesheet" />
          <link href="/lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet" />
          
          {/* Customized Bootstrap Stylesheet */}
          <link href="/css/bootstrap.min.css" rel="stylesheet" />
          
          {/* Template Stylesheet */}
          <link href="/css/style.css" rel="stylesheet" />

          

          {/* Spinner Start */}
          {/* <div id="spinner" className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
            <div className="spinner-grow text-primary" style={{width: '3rem', height: '3rem'}} role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div> */}
          {/* Spinner End */}

          <Navbar />
          {/* Hero Start */}
          <div className="container-fluid pt-5 bg-primary hero-header">
            <div className="container pt-5">
              <div className="row g-5 pt-5">
                <div className="col-lg-6 align-self-center text-center text-lg-start mb-lg-5">
                  <h1 className="display-4 text-white mb-4 animated slideInRight">About Us</h1>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb justify-content-center justify-content-lg-start mb-0">
                      <li className="breadcrumb-item"><a className="text-white" href="/home">Home</a></li>
                      <li className="breadcrumb-item"><a className="text-white" href="#">Pages</a></li>
                      <li className="breadcrumb-item text-white active" aria-current="page">About Us</li>
                    </ol>
                  </nav>
                </div>
                <div className="col-lg-6 align-self-end text-center text-lg-end">
                  <img className="img-fluid" src="/img/hero-img.png" alt="" style={{maxHeight: '300px'}} />
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
                    <button className="btn btn-light px-4"><i className="bi bi-search" /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Full Screen Search End */}

          {/* About Start */}
          <div className="container-fluid py-5">
            <div className="container py-5">
              <div className="row g-5 align-items-center">
                <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
                  <div className="about-img">
                    <img className="img-fluid" src="/img/about-img.jpg" />
                  </div>
                </div>
                <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s">
                  <div className="btn btn-sm border rounded-pill text-primary px-3 mb-3">About Us</div>
                  <h1 className="mb-4">Project Overview</h1>
                  <p className="mb-4">Our project explores innovative communication between two AI-integrated 3D models, enabling them to interact and collaborate in real-time. This pioneering approach aims to enhance user experiences and applications in fields like virtual reality, gaming, and education.</p>
                  <div className="d-flex align-items-center mt-4">
                    <a className="btn btn-primary rounded-pill px-4 me-3" href>Read More</a>
                    <a className="btn btn-outline-primary btn-square me-3" href><i className="fab fa-facebook-f" /></a>
                    <a className="btn btn-outline-primary btn-square me-3" href><i className="fab fa-twitter" /></a>
                    <a className="btn btn-outline-primary btn-square me-3" href><i className="fab fa-instagram" /></a>
                    <a className="btn btn-outline-primary btn-square" href><i className="fab fa-linkedin-in" /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* About End */}

          {/* Team Start */}
          <div className="container-fluid bg-light py-5">
            <div className="container py-5">
              <div className="row g-5 align-items-center">
                <div className="col-lg-5 wow fadeIn" data-wow-delay="0.1s"> 
                  <div className="btn btn-sm border rounded-pill text-primary px-3 mb-3">Our Team</div>
                  <h1 className="mb-4">Meet Our Experienced Team Members</h1>
                  <p className="mb-4">We are a dedicated team of three, combining our expertise in AI, 3D modeling, and software development to push the boundaries of digital interaction and create transformative experiences.</p>
                  <a className="btn btn-primary rounded-pill px-4" href>Read More</a>
                </div>
                <div className="col-lg-7">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="row g-4">
                        <div className="col-12 wow fadeIn" data-wow-delay="0.1s">
                          <div className="team-item bg-white text-center rounded p-4 pt-0">
                            <img className="img-fluid rounded-circle p-4" src="/img/raffae.png" alt="" />
                            <h5 className="mb-0">Abdur Raffae</h5>
                            <small>Team Member</small>
                            <div className="d-flex justify-content-center mt-3">
                              <a className="btn btn-square btn-primary m-1" href><i className="fab fa-facebook-f" /></a>
                              <a className="btn btn-square btn-primary m-1" href><i className="fab fa-twitter" /></a>
                              <a className="btn btn-square btn-primary m-1" href><i className="fab fa-instagram" /></a>
                              <a className="btn btn-square btn-primary m-1" href><i className="fab fa-linkedin-in" /></a>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 wow fadeIn" data-wow-delay="0.5s">
                          <div className="team-item bg-white text-center rounded p-4 pt-0">
                            <img className="img-fluid rounded-circle p-4" src="/img/team-2.jpg" alt="" />
                            <h5 className="mb-0">Jawwad Gul</h5>
                            <small>Team Member</small>
                            <div className="d-flex justify-content-center mt-3">
                              <a className="btn btn-square btn-primary m-1" href><i className="fab fa-facebook-f" /></a>
                              <a className="btn btn-square btn-primary m-1" href><i className="fab fa-twitter" /></a>
                              <a className="btn btn-square btn-primary m-1" href><i className="fab fa-instagram" /></a>
                              <a className="btn btn-square btn-primary m-1" href><i className="fab fa-linkedin-in" /></a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 pt-md-4">
                      <div className="row g-4">
                        <div className="col-12 wow fadeIn" data-wow-delay="0.3s">
                          <div className="team-item bg-white text-center rounded p-4 pt-0">
                            <img className="img-fluid rounded-circle p-4" src="/img/team-3.jpg" alt="" />
                            <h5 className="mb-0">M. Awais Raza</h5>
                            <small>Team Member</small>
                            <div className="d-flex justify-content-center mt-3">
                              <a className="btn btn-square btn-primary m-1" href><i className="fab fa-facebook-f" /></a>
                              <a className="btn btn-square btn-primary m-1" href><i className="fab fa-twitter" /></a>
                              <a className="btn btn-square btn-primary m-1" href><i className="fab fa-instagram" /></a>
                              <a className="btn btn-square btn-primary m-1" href><i className="fab fa-linkedin-in" /></a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Team End */}

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

          <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
          <script src="/lib/wow/wow.min.js"></script>
          <script src="/lib/easing/easing.min.js"></script>
          <script src="/lib/waypoints/waypoints.min.js"></script>
          <script src="/lib/counterup/counterup.min.js"></script>
          <script src="/lib/owlcarousel/owl.carousel.min.js"></script>
          <script src="/js/main.js"></script>
        </div>
      );
    }
  };

  export default About;