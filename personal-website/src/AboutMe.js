import React from 'react';
import { aboutMeText } from './constants';
import pcbImage from './images/pcb_nrf.png';
import poseImage from './images/pose_dipimu.png';
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
            <strong><a href="https://github.com/ray4477/Senior-design-fit-ml">Dance Wearables</a>:</strong> {`Making wearables to track dance movements and display 3D pose for Senior Design.` }
            <br />
            {`Below is a neat
            picture of the PCB layout (4cm x 4cm). Also a picture of the 3D pose from east coast swing! `}
            <br />  
            <img 
              src={pcbImage}
              alt="PCB layout" 
              style={{ width: '400px', height: '350px' }} 
            />
            <img 
              src={poseImage}
              alt="3D pose" 
              style={{ width: '400px', height: '350px' }} 
            />
          </li>

          <li>
            <strong><a href="https://github.com/lhr-solar/BPS">Solar Car BMS</a>:</strong> I work on the battery management system's firmware for UT's solar car team. I've worked on our CANBus drivers, 
            PID fan control, and SIL testing for our system. I've also worked a little bit on PCB layout for our volttemp monitor board and have previously worked
            on wire harnessing for the previous iteration of our car. 
          </li>
          <li>
            <strong><a href="https://github.com/ray4477/RayOS">RayOS</a>:</strong> Hobby operating system inspired by PintOS and OSDev. 
          </li>
          <li>
            <strong>This website!</strong> Built using React and Github Pages.
          </li>
        </ul>
      </section>
      <section>
        <h2>Contact</h2>
        <p>Email: <a href="mailto:raymondjiang2014@gmail.com">raymondjiang2014@gmail.com</a></p>
        <p>Github: <a href="https://github.com/ray4477">link</a></p>
        <p>Linkedin: <a href="https://www.linkedin.com/in/raymondjiang7/">link</a></p>
      </section>
    </main>
  );
};

export default AboutMe;