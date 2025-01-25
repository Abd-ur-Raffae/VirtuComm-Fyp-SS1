import React, { Component } from "react";
import Navbar from "./navbar";

class Contact extends Component {
    render() {
      return (
        <div>
          <meta charSet="utf-8" />
          <title>Contact Us</title>
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
          
         
          
         <Navbar/>
          
          {/* Hero Start */}
          <div className="container-fluid pt-5 bg-primary hero-header">
            <div className="container pt-5">
              <div className="row g-5 pt-5">
                <div className="col-lg-6 align-self-center text-center text-lg-start mb-lg-5">
                  <h1 className="display-4 text-white mb-4 animated slideInRight">Contact Us</h1>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb justify-content-center justify-content-lg-start mb-0">
                      <li className="breadcrumb-item"><a className="text-white" href="/home">Home</a></li>
                      <li className="breadcrumb-item"><a className="text-white" href="#">Pages</a></li>
                      <li className="breadcrumb-item text-white active" aria-current="page">Contact Us</li>
                    </ol>
                  </nav>
                </div>
                <div className="col-lg-6 align-self-end text-center text-lg-end">
                  <div style={{position:'relative', }}>
                    <img className="img-fluid" src="/img/Pi7_paper-plane.png" alt="" style={{position:'relative',top:'21px', maxHeight: '310px'}} />
                  </div>
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
          
          {/* Contact Start */}
          <div className="container-fluid py-5">
            <div className="container py-5">
              <div className="mx-auto text-center wow fadeIn" data-wow-delay="0.1s" style={{maxWidth: '500px'}}>
                <div className="btn btn-sm border rounded-pill text-primary px-3 mb-3">Contact Us</div>
                <h1 className="mb-4">If You Have Any Query, Please Contact Us</h1>
              </div>
              <div className="row justify-content-center">
                <div className="col-lg-7">
                  <p className="text-center mb-4">The contact form is currently inactive. Get a functional and working contact form with Ajax &amp; PHP in a few minutes. Just copy and paste the files, add a little code and you're done. <a href="https://htmlcodex.com/contact-form">Download Now</a>.</p>
                  <div className="wow fadeIn" data-wow-delay="0.3s">
                    <form>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="form-floating">
                            <input type="text" className="form-control" id="name" placeholder="Your Name" />
                            <label htmlFor="name">Your Name</label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-floating">
                            <input type="email" className="form-control" id="email" placeholder="Your Email" />
                            <label htmlFor="email">Your Email</label>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-floating">
                            <input type="text" className="form-control" id="subject" placeholder="Subject" />
                            <label htmlFor="subject">Subject</label>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-floating">
                            <textarea className="form-control" placeholder="Leave a message here" id="message" style={{height: '150px'}} defaultValue={""} />
                            <label htmlFor="message">Message</label>
                          </div>
                        </div>
                        <div className="col-12">
                          <button className="btn btn-primary w-100 py-3" type="submit">Send Message</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Contact End */}
          
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
            <a>Help</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
{/* Footer End */}
          
          {/* Back to Top */}
          <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top pt-2"><i className="bi bi-arrow-up" /></a>
          
          {/* JavaScript Libraries */}
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
        <script src="/lib/wow/wow.min.js"></script>
        <script src="/lib/easing/easing.min.js"></script>
        <script src="/lib/waypoints/waypoints.min.js"></script>
        <script src="/lib/counterup/counterup.min.js"></script>
        <script src="/lib/owlcarousel/owl.carousel.min.js"></script>

          {/* Template Javascript */}
          <script src="/js/main.js"></script>
        </div>
      );
    }
  };

export default Contact;