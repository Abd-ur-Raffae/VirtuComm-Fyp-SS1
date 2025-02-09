import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Index from './components/index.jsx'; // Import your index.jsx component
import About from './components/about.jsx';
import Contact from './components/contact.jsx';
// import Projects from './components/projects.jsx';
import LoginPage from './components/loginpage.jsx';
import RegisterPage from './components/registerpage.jsx';
import Stage1_1 from './components/stage1_1.jsx';
import Stage1_2 from './components/stage1_2.jsx';
import Stage1_3 from './components/stage1_3.jsx';
import {User_tts} from './components/tts.jsx';
import { FetchJsonAndWav } from './components/ghar.jsx';
import AudioPlayerWithSubtitles from './components/temp.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect to /login */}
          <Route path="/home" element={<Index />} />
          <Route path="/about" element={<About />} />
          {/* <Route path="/projects" element={<Projects />} /> */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/stage1_1" element={<Stage1_1 />} />
          <Route path="/stage1_2" element={<Stage1_2 />} />
          <Route path="/stage1_3" element={<Stage1_3 />} />
          <Route path='/tts' element={<User_tts />} />
          <Route path='/ghar' element={<AudioPlayerWithSubtitles />} />
          <Route path='/subtitles_output' element={<FetchJsonAndWav />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
