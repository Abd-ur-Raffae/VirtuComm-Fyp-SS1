import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Index from './components/index.jsx';
import About from './components/about.jsx';
import Contact from './components/contact.jsx';
import LoginPage from './components/loginpage.jsx';
import RegisterPage from './components/registerpage.jsx';
import Stage1_1 from './components/Stage 1.1/stage1_1.jsx';
import Stage1_2 from './components/Stage 1.2/stage1_2.jsx';
import Stage1_3 from './components/Stage 1.3/stage1_3.jsx';
import { User_tts } from './components/tts.jsx';
import { FetchJsonAndWav } from './components/ghar.jsx';
import AudioPlayerWithSubtitles from './components/temp.jsx';
import { AudioProvider } from "./components/Stage 1.3/1.3AudioContext.jsx";
import { ThemeProvider } from "./components/custom elements/themeContext.jsx";  // ✅ Import ThemeProvider

function App() {
  return (
    <Router>
      <ThemeProvider>  {/* ✅ Wrap your app inside ThemeProvider */}
        <AudioProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/home" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/stage1_1" element={<Stage1_1 />} />
              <Route path="/stage1_2" element={<Stage1_2 />} />
              <Route path="/stage1_3" element={<Stage1_3 />} />
              <Route path="/tts" element={<User_tts />} />
              <Route path="/ghar" element={<AudioPlayerWithSubtitles />} />
              <Route path="/subtitles_output" element={<FetchJsonAndWav />} />
            </Routes>
          </div>
        </AudioProvider>
      </ThemeProvider> {/* ✅ Wrap closes here */}
    </Router>
  );
}

export default App;
