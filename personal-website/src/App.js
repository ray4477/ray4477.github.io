import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import AboutMe from './AboutMe';
import Courses from './Courses';
import Life from './Life';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Header />

        <nav>
          <ul className="nav-links">
            <li><Link to="/">Projects</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/life">Life</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<AboutMe />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/life" element={<Life />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

const Header = () => {
  return (
    <header>
      <h1>Raymond Jiang</h1>
      <p>Student at UT Austin</p>
    </header>
  );
};

const Footer = () => {
  return (
    <footer>
      <p>&copy; 2024 Raymond Jiang</p>
    </footer>
  );
};

export default App;
