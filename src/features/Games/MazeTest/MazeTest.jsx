import React, { useState, useEffect, useRef } from 'react';
import './MazeTest.css';

const MazeTest = ({ onClose }) => {
  const [stage, setStage] = useState('intro'); // 'intro', 'level1', 'level2', 'level3', 'win'
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [canLose, setCanLose] = useState(false);
  const containerRef = useRef(null);

  // Handle global mouse move to update the custom cursor pixel
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Delay collision detection and auto-reset when changing levels
  useEffect(() => {
    if (stage.startsWith('level')) {
      setCanLose(false);
      const timer = setTimeout(() => setCanLose(true), 500);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleStart = () => {
    setStage('level1');
  };

  const handleGameOver = () => {
    if (canLose) {
      setStage('intro');
      setCanLose(false);
    }
  };

  const handleNextLevel = () => {
    if (stage === 'level1') setStage('level2');
    else if (stage === 'level2') setStage('level3');
    else if (stage === 'level3') setStage('win');
  };

  const handlePlayAgain = () => {
    setStage('intro');
  };

  const lastPosRef = useRef(null);

  // Reset last position whenever stage changes to prevent teleportation issues
  useEffect(() => {
    lastPosRef.current = null;
  }, [stage]);

  const handleLevelMouseMove = (e) => {
    if (!canLose) return;
    
    const currentPos = { x: e.clientX, y: e.clientY };
    
    if (lastPosRef.current) {
      // Handle the "teleportation" issue where fast mouse moves skip collision boundaries.
      // We interpolate between the last sampled position and the current one.
      const dx = currentPos.x - lastPosRef.current.x;
      const dy = currentPos.y - lastPosRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Check points every 4 pixels along the path
      const steps = Math.max(1, Math.ceil(dist / 4));
      for (let i = 1; i <= steps; i++) {
        const checkX = lastPosRef.current.x + (dx * i) / steps;
        const checkY = lastPosRef.current.y + (dy * i) / steps;
        
        const element = document.elementFromPoint(checkX, checkY);
        if (element && element.classList.contains('maze-deadly-wall')) {
          handleGameOver();
          lastPosRef.current = null;
          return;
        }
      }
    }
    
    lastPosRef.current = currentPos;
  };

  const renderLevelSegments = (type) => {
    // Stop propagation to prevent hitting the black background (game over)
    const stopProps = (e) => e.stopPropagation();

    if (type === 'level1') {
      return (
        <>
          {/* Main vertical stem */}
          <div className="maze-segment" style={{ left: '42%', width: '16%', top: '10%', height: '90%' }} onMouseEnter={stopProps} />
          {/* Top horizontal branch */}
          <div className="maze-segment" style={{ left: '58%', width: '32%', top: '10%', height: '10%' }} onMouseEnter={stopProps} />
          {/* Goal */}
          <div className="maze-goal" style={{ left: '88%', width: '8%', top: '7%', height: '16%' }} onMouseEnter={handleNextLevel}>
             Level 1
          </div>
          {/* Blue pixel indicator start point */}
          <div className="maze-start-pixel" style={{ left: '49.5%', bottom: '5%', width: '1%', height: '1%', backgroundColor: 'navy' }} />
        </>
      );
    }
    
    if (type === 'level2') {
      return (
        <>
          {/* Zig-zag segments */}
          <div className="maze-segment" style={{ left: '10%', right: '10%', top: '10%', height: '10%' }} onMouseEnter={stopProps} />
          <div className="maze-segment" style={{ left: '10%', width: '8%', top: '10%', height: '30%' }} onMouseEnter={stopProps} />
          <div className="maze-segment" style={{ left: '10%', right: '25%', top: '30%', height: '10%' }} onMouseEnter={stopProps} />
          <div className="maze-segment" style={{ right: '25%', width: '8%', top: '30%', height: '30%' }} onMouseEnter={stopProps} />
          <div className="maze-segment" style={{ left: '25%', right: '25%', top: '50%', height: '10%' }} onMouseEnter={stopProps} />
          <div className="maze-segment" style={{ left: '25%', width: '8%', top: '50%', height: '30%' }} onMouseEnter={stopProps} />
          <div className="maze-segment" style={{ left: '25%', right: '10%', top: '70%', height: '10%' }} onMouseEnter={stopProps} />
          <div className="maze-segment" style={{ right: '10%', width: '8%', top: '70%', height: '30%' }} onMouseEnter={stopProps} />
          <div className="maze-segment" style={{ left: '10%', right: '10%', top: '90%', height: '10%' }} onMouseEnter={stopProps} />
          
          <div className="maze-goal" style={{ left: '10%', width: '8%', top: '89%', height: '12%' }} onMouseEnter={handleNextLevel}>
             Level 2
          </div>
          <div className="maze-start-pixel" style={{ right: '13%', top: '13%', width: '1.5%', height: '1.5%', backgroundColor: 'navy' }} />
        </>
      );
    }

    if (type === 'level3') {
      return (
        <>
          {/* Very narrow logic-testing corridors */}
          <div className="maze-segment" style={{ left: '15%', right: '15%', top: '88%', height: '6%' }} onMouseEnter={stopProps} />
          <div className="maze-segment" style={{ right: '15%', width: '4%', top: '75%', height: '15%' }} onMouseEnter={stopProps} />
          <div className="maze-segment" style={{ left: '15%', right: '15%', top: '75%', height: '6%' }} onMouseEnter={stopProps} />
          <div className="maze-segment" style={{ left: '15%', width: '4%', top: '45%', height: '35%' }} onMouseEnter={stopProps} />
          <div className="maze-segment" style={{ left: '15%', right: '50%', top: '45%', height: '6%' }} onMouseEnter={stopProps} />
          
          {/* Very tight part at the end */}
          <div className="maze-segment" style={{ left: '48%', width: '4%', top: '35%', height: '14%' }} onMouseEnter={stopProps} />
          <div className="maze-segment" style={{ left: '44%', width: '8%', top: '32%', height: '4%' }} onMouseEnter={stopProps} />
          <div className="maze-segment" style={{ left: '44%', width: '4%', top: '25%', height: '10%' }} onMouseEnter={stopProps} />
          <div className="maze-segment" style={{ left: '46%', width: '8%', top: '22%', height: '4%' }} onMouseEnter={stopProps} />
          <div className="maze-segment" style={{ left: '52%', width: '2%', top: '18%', height: '8%' }} onMouseEnter={stopProps} />
          
          <div className="maze-goal" style={{ left: '48%', width: '6%', top: '4%', height: '14%' }} onMouseEnter={handleNextLevel}>
             Level 3
          </div>
          <div className="maze-start-pixel" style={{ left: '16%', bottom: '8%', width: '1%', height: '1%', backgroundColor: 'navy' }} />
        </>
      );
    }
  };

  return (
    <div className="maze-test-container" ref={containerRef}>
      {stage === 'intro' && (
        <div className="maze-screen maze-intro">
          <div className="maze-intro-header">
            <h1 data-text="The Maze">The Maze</h1>
            <p className="version">v 1.1</p>
          </div>
          <div className="maze-intro-content">
            <p>STABILITY TEST SEQUENCE 47-B</p>
            <p>CURSOR ACCURACY & LATERAL STABILITY ASSESSMENT</p>
            <p>OBJECTIVE: Navigate pointer through cyan corridor zones.</p>
            <p>WARNING: Contact with invalid boundary (black) will reset test.</p>
            <p>Ensure hardware calibration before proceeding.</p>
            <p>Complete all three difficulty stages to verify driver integrity.</p>
            <p className="hint">sound effects will help</p>
          </div>
          <button className="maze-play-button" onClick={handleStart}>
            PLAY
          </button>
        </div>
      )}

      {(stage === 'level1' || stage === 'level2' || stage === 'level3') && (
        <div className="maze-screen maze-level" onMouseMove={handleLevelMouseMove}>
           {/* Wall background is deadly */}
           <div className="maze-deadly-wall" onMouseMove={handleLevelMouseMove} onMouseEnter={handleGameOver} />
           
           <div className="maze-path-layer">
              {renderLevelSegments(stage)}
           </div>

           {/* Custom blue pixel cursor */}
           <div 
             className="maze-cursor-pixel" 
             style={{ 
               left: mousePos.x - 4, 
               top: mousePos.y - 4 
             }} 
           />
        </div>
      )}

      {stage === 'win' && (
        <div className="maze-screen maze-win">
           <h1>CONGRATULATIONS!</h1>
           <p>SYSTEM TEST PASSED: Cursor accuracy is within acceptable parameters.</p>
           <p>You have completed all levels.</p>
           <div className="maze-win-badge">
             ⭐ TEST COMPLETE ⭐
           </div>
           <button className="maze-play-button" onClick={handlePlayAgain}>
             PLAY AGAIN
           </button>
        </div>
      )}
    </div>
  );
};

export default MazeTest;
