import React from 'react';
import { aboutMeText } from './constants';

const Life = () => {
  return (
    <main>
      <section>
        <p style={{ whiteSpace: 'pre-line' }}>{aboutMeText}</p>
      </section>
      <h2>Hobbies</h2>
      <p>In my free time I love to boulder, run, and weightlift. I'm currently in the Bay Area for the summer and recently tried out surfing and I definitely want to do more. I also recently picked up calligraphy 
        from my dad, and thats been very relaxing.</p>
    </main>
  );
};

export default Life;
