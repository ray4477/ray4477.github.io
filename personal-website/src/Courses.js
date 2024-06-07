import React from 'react';
import { aboutMeText } from './constants';

const Courses = () => {
  return (
    <main>
      <section>
        <p style={{ whiteSpace: 'pre-line' }}>{aboutMeText}</p>
      </section>
      <h2>Courses</h2>

        <ul>
          <li>
            <strong>Probability and Stochastic Processes (ECE 381J):</strong> 
          </li>
          <li>
            <strong>Project 2:</strong> Description of your project 2.
          </li>
          <li>
            <strong>Project 3:</strong> Description of your project 3.
          </li>
        </ul>
    </main>
  );
};

export default Courses;
