import React from 'react';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <Header />
      <MainContent />
      <Footer />
    </div>
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

const MainContent = () => {
  const aboutMeText = `Hello! My name is Raymond Jiang and I am currently a senior studying Electrical and Computer Engineering @ UT Austin.
  
  My main interests are in low level software development (Embedded Systems, Operating Systems, etc) and Signal Processing/Machine learning`;
  return (
    <main>
      <section>
        <p style={{ whiteSpace: 'pre-line' }}>{aboutMeText}</p>
        
      </section>
      <section>
        <h2>Projects</h2>
        <ul>
          <li>
            <strong>Project 1:</strong> Description of your project 1.
          </li>
          <li>
            <strong>Project 2:</strong> Description of your project 2.
          </li>
          <li>
            <strong>Project 3:</strong> Description of your project 3.
          </li>
        </ul>
      </section>
      <section>
        <h2>Contact</h2>
        <p>Email: <a href="mailto:your-email@example.com">your-email@example.com</a></p>
      </section>
    </main>
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
