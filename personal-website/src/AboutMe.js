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
            <strong>Autonomous Drone:</strong> {`My roommate and I both worked at Drone companies so we decided to try making a drone ourselves.`}
            <br />
            {`This is very much a work in progress.`}
          </li>
          <li>
            <strong><a href="https://github.com/lhr-solar/BPS">Solar Car BMS</a>:</strong> I work on the battery management system's firmware for UT's solar car team. I've worked on our CANBus drivers, 
            PID fan control, and SIL testing for our system. I've also worked a little bit on PCB layout for our volttemp monitor board and have previously worked
            on wire harnessing for the previous iteration of our car. 
          </li>
          <li>
            <strong><a href="https://github.com/ray4477/RayOS">RayOS</a>:</strong> Hobby operating system inspired by PintOS and OSDev. 
          </li>
        </ul>
      </section>
      <section>
        <h2>Contact</h2>
        <p>Email: <a href="mailto:raymondjiang2014@gmail.com">raymondjiang2014@gmail.com</a></p>
        <p>Github: <a href="https://github.com/ray4477">link</a></p>
      </section>
    </main>
  );
};

export default AboutMe;