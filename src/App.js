import { useEffect, useState } from 'react';
import './App.css';

import cn from 'classnames'

import Circle from './Circle/Circle';
import SnakeGame from './SnakeGame/SnakeGame';
import { SaperGame } from './SaperGame/SaperGame';
import { TetrisGame } from './TetrisGame/TetrisGame';

// Converts from degrees to radians.
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function(radians) {
return radians * 180 / Math.PI;
};

function App() {
  const [mouseCoords, setMouseCoords] = useState({x: 0, y: 0})
  const [center, setCenter] = useState({x: window.screen.width / 2, y: window.screen.height / 2});
  const [angle, setAngle] = useState(0)
  const [direction, setDirection] = useState("CENTER")

  const [mode, setMode] = useState("CENTER")

  const handleMouseMove = (e) => {
    const newCoords = {x: e.clientX, y: e.clientY}
    const headerElement = document.getElementsByClassName("App")[0]
    setCenter({x: headerElement.offsetWidth / 2, y: headerElement.offsetHeight / 2})

    setMouseCoords({x: newCoords.x - center.x, y: newCoords.y - center.y})
  }

  const handleMouseClick = (e) => {
    if (mode === "CENTER") {
      setMode(direction)
    }
  }

  const handleStartPage = () => {
    setMode("CENTER")
  }

  const vectorToDirection = (radAngle) => {
    const degAngle = Math.degrees(radAngle)

    if (degAngle > 45 && degAngle < 135) {
      return "RIGHT"
    } else if ((degAngle >= 135 && degAngle <= 180) || (degAngle >= -180 && degAngle) <= -125) {
      return "DOWN"
    } else if (degAngle > -125 && degAngle < -45) {
      return "LEFT"
    } else {
      return "UP"
    }
  }
  

  useEffect(() => {
    const startLine = {x: 0, y: 1}
    setAngle(-Math.atan2(startLine.y - mouseCoords.x, startLine.x - mouseCoords.y))
  }, [mouseCoords])
  
  useEffect(() => {
    setDirection(vectorToDirection(angle))
  }, [angle])

  
  return (
    <div className="App" onMouseMove={handleMouseMove} onMouseDown={handleMouseClick}>
      {mode === "CENTER" && <header className={
      cn(
        "App-header",
      )}
      style={{backgroundImage: `linear-gradient(${angle}rad, rgba(0,0,0,1) 0%, #270c0c 90%, #270c0c 100%)`}}>
        <div className={cn(
          'App-button',
          'UP',
          direction === "UP" && "Active",
        )}>
          <img alt="snake" src={direction === "UP" ? 'snake_red.png' : 'snake_black.png'}/>
      </div>
        <div className={cn(
          'App-button',
          'LEFT',
          direction === "LEFT" && "Active",
        )}>
          <img alt="tetris" src={direction === "LEFT" ? 'tetris_red.png' : 'tetris_black.png'}/>
        </div>
        <Circle center={center} angle={angle}/>
        <div className={cn(
          'App-button',
          'RIGHT',
          direction === "RIGHT" && "Active",
        )}>
          <img alt="bomb" src={direction === "RIGHT" ? 'bomb_red.png' : 'bomb_black.png'}/>
        </div>
        <div className={cn(
          'App-button',
          'DOWN',
          direction === "DOWN" && "Active",
        )}>
          <img alt="math" src={direction === "DOWN" ? 'math_red.png' : 'math_black.png'}/>
        </div>
      </header> ||
      mode == "UP" && <SnakeGame center={center} mouseCoords={mouseCoords} handleGoBack={handleStartPage}/> ||
      mode == "RIGHT" && <SaperGame center={center} mouseCoords={mouseCoords} handleGoBack={handleStartPage}/> ||
      mode == "LEFT" && <TetrisGame center={center} mouseCoords={mouseCoords} handleGoBack={handleStartPage}/>
      
      }
    </div>
  );
}

export default App;