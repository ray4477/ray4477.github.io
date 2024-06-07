import React from 'react';
import { aboutMeText } from './constants';

const AboutMe = () => {
  
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

export default AboutMe;