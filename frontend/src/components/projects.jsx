import { Canvas } from "@react-three/fiber";
import { Experience } from "./Experience";
import React from 'react';
import { Experience_2 } from "./1.2Experience";




const Project = () => {
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
                    <a href="/home" className="nav-item nav-link">Home</a>
                    <a href="/about" className="nav-item nav-link">About</a>
                    <a href="/projects" className="nav-item nav-link active">Projects</a>
                    <a href="/contact" className="nav-item nav-link">Contact</a>
                  </div>
                  <button type="button" className="btn text-white p-0 d-none d-lg-block" data-bs-toggle="modal" data-bs-target="#searchModal"><i className="fa fa-search" /></button>
                </div>
              </nav>
            </div>
          </div>
          {/* Navbar End */}

          {/* Hero Start */}
          <div className="container-fluid pt-4 bg-primary hero-header mb-2">
            <div className="container pt-3">
              <div className="row g-3 pt-5">
                <div className="col-lg-6 align-self-center text-center text-lg-start mb-lg-5">
                  <h1 className="display-4 text-white mb-3 animated slideInDown">Phase - 1.1</h1>
                </div>
                <div className="col-lg-6 align-self-end text-center text-lg-end">
                  <img className="img-fluid" src="/img/headerback.png" alt="" />
                </div>
              </div>
            </div>
          </div>
          {/* Hero End */}

        

            {/* <div style={styles.container}>
                <div style={styles.canvasContainer}>
                    <Canvas shadows camera={{ position: [0, 3, 8], fov: 35 }}>
                        <color attach="background" args={["#ececec"]} />
                        <Experience />
                    </Canvas>
                </div>
            </div> */}

            <div style={styles.container}>
                <div style={styles.canvasContainer}>
                    <Canvas shadows camera={{ position: [0, 3, 8], fov: 35 }}>
                        <color attach="background" args={["#ececec"]} />
                        <Experience_2 />
                    </Canvas>
                </div>
            </div>

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
        </div>
    );
};

const styles = {
    header: {
        backgroundColor: '#333',
        color: '#fff',
        padding: '10px 20px',
        textAlign: 'center',
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh', // Reduced height so footer is visible
    },
    canvasContainer: {
        width: '80%',
        height: '80%', // Keep this to adjust canvas size
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
};

export default Project;

