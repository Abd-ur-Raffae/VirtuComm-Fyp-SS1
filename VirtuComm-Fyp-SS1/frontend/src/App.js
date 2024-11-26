import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Index from './components/index.jsx'; // Import your index.jsx component
import About from './components/about.jsx';
import Contact from './components/contact.jsx';
// import Projects from './components/projects.jsx';
import LoginPage from './components/loginpage.jsx';
import RegisterPage from './components/registerpage.jsx';
import Stage1_1 from './components/stage1_1.jsx';
import Stage1_2 from './components/stage1_2.jsx';
import User_tts from './components/tts.jsx'



function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/home" element={<Index />} />
          <Route path="/about" element={<About />} />
          {/* <Route path="/projects" element={<Projects />} /> */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/stage1_1" element={<Stage1_1 />} />
          <Route path="/stage1_2" element={<Stage1_2 />} />
          <Route path='/tts' element={<User_tts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
