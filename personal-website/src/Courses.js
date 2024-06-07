// Courses.js
import React from 'react';
import { aboutMeText } from './constants';

import coursesBySemester from './coursesData';
import './Courses.css'; // CSS for styling

const Courses = () => {
  return (
    <main>
            <section>
        <p style={{ whiteSpace: 'pre-line' }}>{aboutMeText}</p>
      </section>
      <h2>Courses</h2>
      {coursesBySemester.map((semester, index) => (
        <div key={index} className="semester-container">
          <h2 className="semester-title">{semester.semester}</h2>
          <div className="courses-list">
            {semester.courses.map(course => (
              <div key={course.id} className="course-item">
                <ul><strong>{course.name}</strong> {course.description}</ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </main>
  );
};

export default Courses;
