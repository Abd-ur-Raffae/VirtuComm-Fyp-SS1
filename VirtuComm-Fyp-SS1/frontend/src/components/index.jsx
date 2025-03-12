import React, { Component } from 'react';
import axios from 'axios';
import 'swiper/css';
import MySwiper from './swiper';
import Navbar from './navbar'; // Assuming this is your navigation component
import Footer from './footer';

class Index extends Component {
  state = {
    isAuthenticated: false,
    username: '',
    csrfToken: '',
  };

  componentDidMount() {
    this.checkLoginStatus();
    this.fetchCsrfToken();
  }

  checkLoginStatus = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/check-login/', { withCredentials: true });
      this.setState({
        isAuthenticated: response.data.isAuthenticated,
        username: response.data.username || '', // Assuming the backend returns the username
      });
    } catch (error) {
      this.setState({ isAuthenticated: false, username: '' });
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
      await axios.post('http://localhost:8000/api/logout/', {}, {
        headers: { 'X-CSRFToken': this.state.csrfToken },
        withCredentials: true,
      });
      this.setState({ isAuthenticated: false, username: '' });
    } catch (error) {
      console.error('Logout error:', error.response?.data?.error || error.message);
    }
  };

  render() {
    return (
      <div>
        <meta charSet="utf-8" />
        <title>VirtuComm</title>
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        {/* ... (rest of the head content remains unchanged) */}

        <Navbar 
          isAuthenticated={this.state.isAuthenticated} 
          username={this.state.username} 
          onLogout={this.logoutUser} 
        />

        {/* Hero Section */}
        <div className="container-fluid pt-5 bg-primary hero-header mb-5">
          <div className="container pt-5">
            <div className="row g-5 pt-5">
              <div className="col-lg-6 align-self-center text-center text-lg-start mb-lg-5">
                <h1 className="display-4 text-white mb-4 animated slideInRight">Exploring Dialogue Dynamics Between AIs</h1>
                <p className="text-white mb-4 animated slideInRight">An innovative exploration of dialogue dynamics...</p>
                <a href="/scenario-selection" className="btn btn-light py-sm-3 px-sm-5 rounded-pill me-3 animated slideInRight">Try Scenarios</a>
                <a href="/contact" className="btn btn-outline-light py-sm-3 px-sm-5 rounded-pill animated slideInRight">Contact Us</a>
              </div>
              <div className="col-lg-6 align-self-end text-center text-lg-end">
                <img className="img-fluid" src="/img/headerback.png" alt="" />
              </div>
            </div>
          </div>
        </div>

        {/* Rest of the content (Search, Case, Footer) remains unchanged */}
        <Footer />
        <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top pt-2"><i className="bi bi-arrow-up" /></a>
      </div>
    );
  }
}

export default Index;