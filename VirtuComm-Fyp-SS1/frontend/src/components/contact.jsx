import React, { Component } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import axios from "axios";
import './contact.css'; // We'll add fade-out CSS here

class Contact extends Component {
  state = {
    name: "",
    email: "",
    subject: "",
    message: "",
    submitted: false,
    error: null,
  };

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, subject, message } = this.state;

    try {
      await axios.post("http://localhost:8000/api/contact/", { name, email, subject, message }); // Adjust URL based on your backend
      this.setState({ submitted: true });
    } catch (error) {
      this.setState({ error: "Submission failed. Please try again." });
    }
  };

  render() {
    const { name, email, subject, message, submitted, error } = this.state;

    return (
      <div>
        <Navbar />

        {/* ... your hero section and other layout here ... */}
        {/* Hero Section */}
        <div className="container-fluid pt-5 bg-primary hero-header mb-5">
          <div className="container pt-5">
            <div className="row g-5 pt-5">
              <div className="col-lg-6 align-self-center text-center text-lg-start mb-lg-5">
                <h1 className="display-4 text-white mb-4 animated slideInRight">Exploring Dialogue Dynamics Between AIs</h1>
                <p className="text-white mb-4 animated slideInRight">An innovative exploration of dialogue dynamics...</p>
                <a href="/Scenarioselection" className="btn btn-light py-sm-3 px-sm-5 rounded-pill me-3 animated slideInRight">Try Scenarios</a>
                <a href="/contact" className="btn btn-outline-light py-sm-3 px-sm-5 rounded-pill animated slideInRight">Contact Us</a>
              </div>
              <div className="col-lg-6 align-self-end text-center text-lg-end">
                <img className="img-fluid" src="/img/headerback.png" alt="" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className={`col-lg-7 ${submitted ? "fade-out" : ""}`}>
              {!submitted ? (
                <form onSubmit={this.handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          placeholder="Your Name"
                          value={name}
                          onChange={this.handleChange}
                          required
                        />
                        <label htmlFor="name">Your Name</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="Your Email"
                          value={email}
                          onChange={this.handleChange}
                          required
                        />
                        <label htmlFor="email">Your Email</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="subject"
                          placeholder="Subject"
                          value={subject}
                          onChange={this.handleChange}
                          required
                        />
                        <label htmlFor="subject">Subject</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <textarea
                          className="form-control"
                          placeholder="Leave a message here"
                          id="message"
                          style={{ height: "150px" }}
                          value={message}
                          onChange={this.handleChange}
                          required
                        />
                        <label htmlFor="message">Message</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <button
                        className="btn btn-primary w-100 py-3"
                        type="submit"
                      >
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="text-center alert alert-success mt-4">
                  Your query has been sent to customer support.
                </div>
              )}
              {error && (
                <div className="text-center alert alert-danger mt-3">{error}</div>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default Contact;
