import { useEffect, useState } from 'react'
import styles from './TetrisGame.module.css'
import { TetrisFigure } from './TetrisFigure/TetrisFigure'
import { isEqual, random } from 'lodash'
import { CELL_SIZE, TetrisCell } from './TetrisCell/TetrisCell'
import { Layer, Line, Stage, Text } from 'react-konva'

const FIGURES = [
    [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
    [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
    [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
]

const SPEED_DEFAULT = 500
const SPEED_MAX = 100
const BORDER_Y = window.innerHeight - 100
const BORDER_X = window.innerWidth


export const TetrisGame = ({center, mouseCoords, handleGoBack}) => {
    const getFigureTemplate = () => {
        const figureTemplate = {
            cells: FIGURES[random(0, FIGURES.length - 1)],
            position: { x: Math.floor((mouseCoords.x + center.x) / CELL_SIZE), y: 0 },
            rotation: 0,
        }
        return figureTemplate
    }

    const [placedFigures, setPlacedFigures] = useState([])

    const [currentX, setCurrentX] = useState(0)
    const [currentY, setCurrentY] = useState(0)
    const [currentCells, setCurrentCells] = useState(getFigureTemplate().cells)
    const [currentRotation, setCurrentRotation] = useState(0)

    const [speed, setSpeed] = useState(1000)
    const [loose, setLoose] = useState(false)

    useEffect(() => {
        setCurrentX(Math.floor((mouseCoords.x + center.x) / CELL_SIZE))
    }, [mouseCoords.x, center.x])
    
    useEffect(() => {
        const cantMoveDown = () => {
            const newCells = currentCells

            for (let i = 0; i < newCells.length; i++) {
                const newCell = newCells[i]
                for (let j = 0; j < placedFigures.length; j++) {
                    const oldCells = placedFigures[j].cells
                    for (let k = 0; k < oldCells.length; k++) {
                        const oldCell = oldCells[k]
                        if (isEqual(
                            { x: oldCell.x + placedFigures[j].position.x, y: oldCell.y + placedFigures[j].position.y },
                            { x: newCell.x + currentX, y: newCell.y + currentY + 1})
                        ) {
                            return true
                        }
                    }
                }
            }

            return false
        }
        const isReachBorder = () => {
            const newCells = currentCells

            for (let i = 0; i < newCells.length; i++) {
                const newCell = newCells[i]
                if ((newCell.y + currentY + 1) * CELL_SIZE  > BORDER_Y) {
                    return true
                }
            }
            return false
        }
        const moveDownFigure = () => {
            if (cantMoveDown() || isReachBorder()) {
                setPlacedFigures((figures) => [...figures, {
                    cells: currentCells,
                    position: {x: currentX, y: currentY},
                    rotation: currentRotation
                }])

                return "NEXT FIGURE";
            }

            setCurrentY(y => y + 1)
            return "GO ON"
        }
        const id = setInterval(() => {
            const result = moveDownFigure()

            switch (result) {
                case "NEXT FIGURE":
                    const result = setNewFigure()
                    if (result === "LOOSE") {
                        setLoose(true)
                    }
                    break;
                default:
                    break;
            }
        }, speed);

        const setNewFigure = () => {
            const newFigure = getFigureTemplate()
            setCurrentX(newFigure.position.x)
            setCurrentY(newFigure.position.y)
            setCurrentCells(newFigure.cells)
            setCurrentRotation(newFigure.rotation)

            return "OK"
        }
        return () => clearInterval(id);
    }, [currentY])

    useEffect(()=>{
        const cantMoveDown = () => {
            const newCells = currentCells

            for (let i = 0; i < newCells.length; i++) {
                const newCell = newCells[i]
                for (let j = 0; j < placedFigures.length; j++) {
                    const oldCells = placedFigures[j].cells
                    for (let k = 0; k < oldCells.length; k++) {
                        const oldCell = oldCells[k]
                        if (isEqual(
                            { x: oldCell.x + placedFigures[j].position.x, y: oldCell.y + placedFigures[j].position.y },
                            { x: newCell.x + currentX, y: newCell.y + currentY + 1})
                        ) {
                            return true
                        }
                    }
                }
            }

            return false
        }
        if (cantMoveDown()) {
            setLoose(true)
        }
    }, [currentCells])
    return <div className={styles.TetrisGame} onMouseDown={() => setSpeed(SPEED_MAX)} onMouseUp={() => setSpeed(SPEED_DEFAULT)}>
        <Stage width={window.innerWidth} height={window.innerHeight}>
        {loose ? 
        <Layer>
            <Text className={styles.LooseText} text="YOU LOOSE" fontSize={30} fill="red" onClick={handleGoBack} 
            height={window.innerHeight}
            width={window.innerWidth}
            verticalAlign='middle'
            align="center"
            
                />
                </Layer>
                :
            <Layer>
                {placedFigures?.map((figure, index) => <TetrisFigure key={index} cells={figure.cells} position={figure.position} rotation={figure.rotation} />)}
                <TetrisFigure cells={currentCells} position={{x: currentX, y: currentY}} rotation={currentRotation}/>
                <Line
                    points={[0,BORDER_Y + CELL_SIZE, BORDER_X, BORDER_Y + CELL_SIZE]}
                    stroke='red'
                    shadowBlur= {10}
                    shadowColor='red'
                    shadowOffsetY={10}
                    />
            </Layer>
        }
        </Stage>
    </div>
}




// todo:
//1. handle rotation
//2. incapsulate figure cell templates
//3. add win conditions
//4. use good color (from global params)