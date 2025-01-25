import React, { Component } from 'react';
import 'swiper/css';

class Footer extends Component {
      render() {
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
                    <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">© <a className="border-bottom" href="#">VirtuComm</a>, All Rights Reserved.Designed By <a className="border-bottom" href="#">Us</a> Distributed By <a className="border-bottom" href="">Our hosting site</a>
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
  
export default Footer;