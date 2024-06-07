import React from 'react';
import { aboutMeText } from './constants';

const Life = () => {
  return (
    <main>
      <section>
        <p style={{ whiteSpace: 'pre-line' }}>{aboutMeText}</p>
      </section>
      <h2>Life</h2>
      <p>Life at UT Austin...</p>
    </main>
  );
};

export default Life;
