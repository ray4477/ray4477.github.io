import React from 'react';
import { aboutMeText } from './constants';

const Life = () => {
  return (
    <main>
      <section>
        <p style={{ whiteSpace: 'pre-line' }}>{aboutMeText}</p>
      </section>
      <h2>Hobbies</h2>
      <p>In my free time I love running and weight lifting. Some goals I have are:</p>
      <ul>
        <li>Eventually run a marathon</li>
        <li>Do a half ironman (70.3)</li>
        <li>Boulder at V5-V6 level</li>
      </ul>
    </main>
  );
};

export default Life;
