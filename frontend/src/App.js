import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Index from './components/index.jsx'; // Import your index.jsx component
import About from './components/about.jsx';
import Contact from './components/contact.jsx';
import Projects from './components/projects.jsx';
import LoginPage from './components/loginpage.jsx';
import RegisterPage from './components/registerpage.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/home" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
