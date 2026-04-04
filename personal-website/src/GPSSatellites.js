import React, { useState, useEffect, useRef, startTransition, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import RinexParser from './utils/RinexParser';
import './GPSSatellites.css';

// Orbital mechanics utilities
class OrbitalMechanics {
  static keplerToCartesian(elements, time) {
    const { semiMajorAxis, eccentricity, inclination, raan, argOfPerigee, meanAnomaly, epoch } = elements;
    
    // Time difference in seconds
    const dt = (time - epoch) / 1000;
    
    // Mean motion (rad/s)
    const mu = 3.986004418e14; // Earth's gravitational parameter
    const n = Math.sqrt(mu / Math.pow(semiMajorAxis, 3));
    
    // Mean anomaly at time t
    const M = meanAnomaly + n * dt;
    
    // Solve Kepler's equation for eccentric anomaly
    let E = M;
    for (let i = 0; i < 10; i++) {
      E = M + eccentricity * Math.sin(E);
    }
    
    // True anomaly
    const nu = 2 * Math.atan2(
      Math.sqrt(1 + eccentricity) * Math.sin(E / 2),
      Math.sqrt(1 - eccentricity) * Math.cos(E / 2)
    );
    
    // Distance from Earth center
    const r = semiMajorAxis * (1 - eccentricity * Math.cos(E));
    
    // Position in orbital plane
    const x_orb = r * Math.cos(nu);
    const y_orb = r * Math.sin(nu);
    const z_orb = 0;
    
    // Rotation matrices
    const cos_raan = Math.cos(raan);
    const sin_raan = Math.sin(raan);
    const cos_inc = Math.cos(inclination);
    const sin_inc = Math.sin(inclination);
    const cos_arg = Math.cos(argOfPerigee);
    const sin_arg = Math.sin(argOfPerigee);
    
    // Transform to Earth-centered inertial coordinates
    const x = (cos_raan * cos_arg - sin_raan * sin_arg * cos_inc) * x_orb +
              (-cos_raan * sin_arg - sin_raan * cos_arg * cos_inc) * y_orb;
    
    const y = (sin_raan * cos_arg + cos_raan * sin_arg * cos_inc) * x_orb +
              (-sin_raan * sin_arg + cos_raan * cos_arg * cos_inc) * y_orb;
    
    const z = (sin_arg * sin_inc) * x_orb + (cos_arg * sin_inc) * y_orb;
    
    return { 
      x: x / 1000000, y: y / 1000000, z: z / 1000000, // Convert to thousands of km for visualization
      x_m: x, y_m: y, z_m: z // Keep original meters for precision display
    };
  }
  
  static eciToEcef(eciPos, time) {
    // Convert ECI to ECEF coordinates
    // Earth rotation rate (rad/s)
    const omegaEarth = 7.2921159e-5;
    
    // Greenwich Mean Sidereal Time
    const j2000 = new Date('2000-01-01T12:00:00Z').getTime();
    const centuriesSinceJ2000 = (time - j2000) / (1000 * 86400 * 36525);
    const gmst = 280.46061837 + 360.98564736629 * (time - j2000) / (1000 * 86400) + 
                 0.000387933 * centuriesSinceJ2000 * centuriesSinceJ2000 - 
                 centuriesSinceJ2000 * centuriesSinceJ2000 * centuriesSinceJ2000 / 38710000;
    
    const gmstRad = (gmst % 360) * Math.PI / 180;
    
    // Rotation matrix from ECI to ECEF
    const cosGmst = Math.cos(gmstRad);
    const sinGmst = Math.sin(gmstRad);
    
    const x_ecef = cosGmst * eciPos.x_m + sinGmst * eciPos.y_m;
    const y_ecef = -sinGmst * eciPos.x_m + cosGmst * eciPos.y_m;
    const z_ecef = eciPos.z_m;
    
    return { x: x_ecef, y: y_ecef, z: z_ecef };
  }
  
  static calculateVelocity(elements, time) {
    // Calculate velocity using numerical differentiation
    const dt = 1; // 1 second
    const pos1 = this.keplerToCartesian(elements, time - dt * 500);
    const pos2 = this.keplerToCartesian(elements, time + dt * 500);
    
    const vx = (pos2.x_m - pos1.x_m) / dt;
    const vy = (pos2.y_m - pos1.y_m) / dt;
    const vz = (pos2.z_m - pos1.z_m) / dt;
    
    const speed = Math.sqrt(vx*vx + vy*vy + vz*vz);
    
    return { vx, vy, vz, speed };
  }
  
  static generateOrbitPoints(elements, numPoints = 100) {
    const points = [];
    const period = 2 * Math.PI * Math.sqrt(Math.pow(elements.semiMajorAxis, 3) / 3.986004418e14);
    
    for (let i = 0; i < numPoints; i++) {
      const time = elements.epoch + (i / numPoints) * period * 1000;
      const pos = this.keplerToCartesian(elements, time);
      points.push([pos.x, pos.y, pos.z]);
    }
    
    return points;
  }
}

// Initialize with sample data, will be replaced by RINEX data
const initialGPSData = RinexParser.generateSampleData();

function Earth() {
  const earthRef = useRef();
  
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });
  
  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[6.371, 32, 32]} />
      <meshStandardMaterial color="#4A90E2" />
    </mesh>
  );
}

function Satellite({ satellite, currentTime, onHover, isHovered }) {
  const meshRef = useRef();
  const position = OrbitalMechanics.keplerToCartesian(satellite, currentTime);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.set(position.x, position.y, position.z);
    }
  });
  
  const handlePointerOver = () => {
    startTransition(() => {
      onHover(satellite);
    });
  };
  
  const handlePointerOut = () => {
    startTransition(() => {
      onHover(null);
    });
  };
  
  return (
    <group>
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial color={isHovered ? "#FF6B6B" : "#FFD93D"} />
      </mesh>
      {isHovered && (
        <Suspense fallback={null}>
          <Text
            position={[position.x + 1, position.y + 1, position.z]}
            fontSize={1}
            color="white"
          >
            PRN {satellite.prn}
          </Text>
        </Suspense>
      )}
    </group>
  );
}

function OrbitPath({ satellite }) {
  const points = OrbitalMechanics.generateOrbitPoints(satellite);
  
  return (
    <Line
      points={points}
      color="#FFFFFF"
      lineWidth={1}
      transparent
      opacity={0.3}
    />
  );
}

function GPSSatellites() {
  const [satellites, setSatellites] = useState(initialGPSData);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [selectedTime, setSelectedTime] = useState(new Date().toISOString());
  const [timeInputType, setTimeInputType] = useState('text');
  const [timeInputValue, setTimeInputValue] = useState(new Date().toISOString().slice(0, 19));
  const [hoveredSatellite, setHoveredSatellite] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPRN, setSelectedPRN] = useState('');
  const [prnStats, setPrnStats] = useState(null);

  useEffect(() => {
    setCurrentTime(new Date(selectedTime).getTime());
  }, [selectedTime]);

  const handleTimeChange = (e) => {
    const value = e.target.value;
    setTimeInputValue(value);
    
    if (timeInputType === 'datetime-local') {
      setSelectedTime(value + ':00.000Z');
    } else {
      // Handle text input - try multiple formats
      try {
        let date;
        
        // Try parsing as-is first
        date = new Date(value);
        
        // If invalid, try adding missing parts
        if (isNaN(date.getTime())) {
          // Try adding seconds if missing
          if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
            date = new Date(value + ':00');
          }
          // Try adding time if only date
          else if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            date = new Date(value + 'T12:00:00');
          }
          // Try current date if only time
          else if (/^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
            const today = new Date().toISOString().slice(0, 10);
            date = new Date(today + 'T' + value);
          }
        }
        
        if (!isNaN(date.getTime())) {
          setSelectedTime(date.toISOString());
        }
      } catch (error) {
        console.error('Invalid time format:', error);
      }
    }
  };

  const toggleTimeInputType = () => {
    const newType = timeInputType === 'datetime-local' ? 'text' : 'datetime-local';
    setTimeInputType(newType);
    
    if (newType === 'datetime-local') {
      setTimeInputValue(selectedTime.slice(0, 16));
    } else {
      setTimeInputValue(selectedTime.slice(0, 19));
    }
  };

  const setToCurrentTime = () => {
    const now = new Date();
    setSelectedTime(now.toISOString());
    if (timeInputType === 'datetime-local') {
      setTimeInputValue(now.toISOString().slice(0, 16));
    } else {
      setTimeInputValue(now.toISOString().slice(0, 19));
    }
  };

  const fetchEphemerisData = async () => {
    setLoading(true);
    try {
      console.log('Fetching GPS observation data from NOAA CORS...');
      
      // Attempt to fetch real ephemeris data
      const ephemerisData = await RinexParser.fetchEphemerisData(new Date(selectedTime));
      setSatellites(ephemerisData);
      
      console.log(`Loaded ${ephemerisData.length} satellites`);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching ephemeris data:', error);
      // Fall back to sample data
      setSatellites(RinexParser.generateSampleData());
      setLoading(false);
    }
  };

  const formatKeplerElements = (satellite) => {
    if (!satellite) return null;
    
    return {
      'Semi-major Axis': `${(satellite.semiMajorAxis / 1000).toFixed(2)} km`,
      'Eccentricity': satellite.eccentricity.toFixed(6),
      'Inclination': `${(satellite.inclination * 180 / Math.PI).toFixed(2)}°`,
      'RAAN': `${(satellite.raan * 180 / Math.PI).toFixed(2)}°`,
      'Arg of Perigee': `${(satellite.argOfPerigee * 180 / Math.PI).toFixed(2)}°`,
      'Mean Anomaly': `${(satellite.meanAnomaly * 180 / Math.PI).toFixed(2)}°`
    };
  };

  const handlePRNLookup = () => {
    const prn = parseInt(selectedPRN);
    const satellite = satellites.find(sat => sat.prn === prn);
    
    if (satellite) {
      const eciPos = OrbitalMechanics.keplerToCartesian(satellite, currentTime);
      const ecefPos = OrbitalMechanics.eciToEcef(eciPos, currentTime);
      const velocity = OrbitalMechanics.calculateVelocity(satellite, currentTime);
      
      setPrnStats({
        satellite,
        eciPos,
        ecefPos,
        velocity,
        altitude: Math.sqrt(eciPos.x_m*eciPos.x_m + eciPos.y_m*eciPos.y_m + eciPos.z_m*eciPos.z_m) - 6371000,
        time: currentTime
      });
    } else {
      setPrnStats(null);
      alert(`Satellite PRN ${prn} not found in current constellation.`);
    }
  };

  const downloadEphemeris = () => {
    const rinexData = RinexParser.generateRinexFile(satellites, new Date(currentTime));
    const blob = new Blob([rinexData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ephemeris_${new Date(currentTime).toISOString().slice(0, 10)}.rnx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="gps-satellites-container">
      <div className="controls-panel">
        <h1>GPS Satellite Constellation</h1>
        
        <div className="description">
          <p>Built for fun and because there's not really a good website to get GPS satellite positions from a time input.</p>
        </div>
        
        <div className="time-control">
          <div className="time-control-header">
            <label htmlFor="time-input">Select Time:</label>
            <button 
              className="time-toggle-btn"
              onClick={toggleTimeInputType}
              title={timeInputType === 'datetime-local' ? 'Switch to precise input' : 'Switch to date picker'}
            >
              {timeInputType === 'datetime-local' ? 'Precise' : 'Picker'}
            </button>
          </div>
          {timeInputType === 'datetime-local' ? (
            <input
              id="time-input"
              type="datetime-local"
              value={timeInputValue}
              onChange={handleTimeChange}
              step="1"
            />
          ) : (
            <div className="precise-time-input">
              <input
                id="time-input-precise"
                type="text"
                value={timeInputValue}
                onChange={handleTimeChange}
                placeholder="2024-01-15T14:30:45"
                className="iso-time-input"
              />
              <small className="time-format-hint">
                Examples: 2024-01-15T14:30:45, 2024-01-15, 14:30:45
              </small>
            </div>
          )}
          <div className="time-controls">
            <button 
              className="time-action-btn"
              onClick={setToCurrentTime}
              title="Set to current time"
            >
              Now
            </button>
          </div>
          <div className="current-time-display">
            <small>Current: {new Date(currentTime).toISOString()}</small>
          </div>
        </div>
        
        <button 
          onClick={fetchEphemerisData}
          disabled={loading}
          className="fetch-button"
        >
          {loading ? 'Loading...' : 'Fetch Latest Ephemeris Data'}
        </button>
        
        <div className="satellite-count">
          Active Satellites: {satellites.length}
        </div>
        
        <div className="prn-lookup">
          <h3>PRN Lookup</h3>
          <div className="prn-input-group">
            <input
              type="number"
              value={selectedPRN}
              onChange={(e) => setSelectedPRN(e.target.value)}
              placeholder="Enter PRN (1-32)"
              min="1"
              max="32"
              className="prn-input"
            />
            <button 
              onClick={handlePRNLookup}
              disabled={!selectedPRN}
              className="prn-lookup-btn"
            >
              Lookup
            </button>
          </div>
          
          {prnStats && (
            <div className="prn-stats">
              <h4>PRN {prnStats.satellite.prn} Statistics</h4>
              <div className="stats-grid">
                <div className="stat-group">
                  <h5>Position (ECI)</h5>
                  <div>X: {prnStats.eciPos.x_m.toFixed(1)} m</div>
                  <div>Y: {prnStats.eciPos.y_m.toFixed(1)} m</div>
                  <div>Z: {prnStats.eciPos.z_m.toFixed(1)} m</div>
                </div>
                
                <div className="stat-group">
                  <h5>Position (ECEF)</h5>
                  <div>X: {prnStats.ecefPos.x.toFixed(1)} m</div>
                  <div>Y: {prnStats.ecefPos.y.toFixed(1)} m</div>
                  <div>Z: {prnStats.ecefPos.z.toFixed(1)} m</div>
                </div>
                
                <div className="stat-group">
                  <h5>Velocity (ECI)</h5>
                  <div>Vx: {prnStats.velocity.vx.toFixed(1)} m/s</div>
                  <div>Vy: {prnStats.velocity.vy.toFixed(1)} m/s</div>
                  <div>Vz: {prnStats.velocity.vz.toFixed(1)} m/s</div>
                  <div><strong>Speed: {prnStats.velocity.speed.toFixed(1)} m/s</strong></div>
                </div>
                
                <div className="stat-group">
                  <h5>Orbital Info</h5>
                  <div>Altitude: {(prnStats.altitude / 1000).toFixed(1)} km</div>
                  <div>Period: {(2 * Math.PI * Math.sqrt(Math.pow(prnStats.satellite.semiMajorAxis, 3) / 3.986004418e14) / 3600).toFixed(2)} hrs</div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="ephemeris-download">
          <h3>Download Ephemeris</h3>
          <p>Download current constellation ephemeris data in RINEX format</p>
          <button 
            onClick={downloadEphemeris}
            className="download-btn"
          >
            Download RINEX File
          </button>
        </div>
      </div>

      <div className="visualization-container">
        <Canvas camera={{ position: [50, 50, 50], fov: 60 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} />
            
            <Earth />
            
            {satellites.map((satellite) => (
              <React.Fragment key={satellite.prn}>
                <Satellite
                  satellite={satellite}
                  currentTime={currentTime}
                  onHover={setHoveredSatellite}
                  isHovered={hoveredSatellite?.prn === satellite.prn}
                />
                <OrbitPath satellite={satellite} />
              </React.Fragment>
            ))}
            
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          </Suspense>
        </Canvas>
      </div>

      {hoveredSatellite && (
        <div className="kepler-elements-panel">
          <h3>Satellite PRN {hoveredSatellite.prn}</h3>
          <div className="kepler-elements">
            {Object.entries(formatKeplerElements(hoveredSatellite)).map(([key, value]) => (
              <div key={key} className="kepler-element">
                <span className="element-name">{key}:</span>
                <span className="element-value">{value}</span>
              </div>
            ))}
          </div>
          <div className="position-info">
            <h4>Current Position</h4>
            {(() => {
              const eciPos = OrbitalMechanics.keplerToCartesian(hoveredSatellite, currentTime);
              const ecefPos = OrbitalMechanics.eciToEcef(eciPos, currentTime);
              return (
                <div>
                  <div className="coordinate-system">
                    <h5>ECI (Earth-Centered Inertial)</h5>
                    <div>X: {eciPos.x_m.toFixed(1)} m</div>
                    <div>Y: {eciPos.y_m.toFixed(1)} m</div>
                    <div>Z: {eciPos.z_m.toFixed(1)} m</div>
                  </div>
                  <div className="coordinate-system">
                    <h5>ECEF (Earth-Centered Earth-Fixed)</h5>
                    <div>X: {ecefPos.x.toFixed(1)} m</div>
                    <div>Y: {ecefPos.y.toFixed(1)} m</div>
                    <div>Z: {ecefPos.z.toFixed(1)} m</div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

export default GPSSatellites;
