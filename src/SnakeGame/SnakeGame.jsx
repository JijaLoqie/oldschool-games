import { useEffect, useState } from "react"
import {SnakeCell, CELL_SIZE} from "./SnakeCell/SnakeCell"
import styles from "./SnakeGame.module.css"

import { isEqual, random, result } from "lodash"

import {Stage, Layer, Text, Rect, Circle, Line} from 'react-konva'


const SnakeGame = ({mouseCoords, center, handleGoBack}) => {
    const [snake, setSnake] = useState([])
    const [buffs, setBuffs] = useState([{x: 5, y: 5, color: "blue", buffRate: 1}])
    const [snakeSize, setSnakeSize] = useState(5)
    const [loose, setLoose] = useState(false)


    useEffect(() => {
        setBuffs(oldBuff => [...oldBuff, {x: random(0, 10), y: random(0, 10), color: "blue", buffRate: 1}])
    }, [snakeSize])


    useEffect(() => {
        const getCell = () => {
            return {x: Math.floor((mouseCoords.x + center.x) / CELL_SIZE), y: Math.floor((mouseCoords.y + center.y) / CELL_SIZE)}
        }
        const currentCell = getCell()


        const checkMove = (newCell) => {
            for (let i = 1; i < snake.length; i++) {
                if (isEqual(newCell, snake[i])) {
                    return "LOOSE"
                }
            }
            return "NEXT"
        }
        const checkBuff = (cell) => {
            const res = buffs.filter(element => element.x === cell.x && element.y === cell.y)
            if (res.length !== 0) {
                const buffRate = res[0].buffRate
                setBuffs(wasBuff => wasBuff.filter(element => !isEqual(element, res[0])))
                return buffRate
            }
            return 0
        }
        if (!isEqual(snake[0], currentCell) && !loose) {
            const res = checkMove(currentCell)

            switch (res) {
                case "NEXT":
                    const res = checkBuff(currentCell)
                    setSnakeSize(oldSize => oldSize + res)
                    setSnake(oldSnake => {
                        let newSnake = [currentCell, ...oldSnake]
                        if (newSnake.length > snakeSize) {
                            newSnake.pop()
                        }
                        return newSnake
                    })
                    break;

                case "LOOSE":
                    setBuffs([])
                    setLoose(true)
                    break;
            
                default:
                    break;
            }
        }


    }, [mouseCoords])



    return (
    <div className={styles.SnakeGame}>
        <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
            {loose ? 
            <Text className={styles.LooseText} text="YOU LOOSE" fontSize={30} fill="red" onClick={handleGoBack} 
            height={window.innerHeight}
            width={window.innerWidth}
            verticalAlign='middle'
            align="center"
            
                />
                :
                snake.map((cell, index) => <SnakeCell key={index} x={cell.x} y={cell.y} color="red"/>)
            }
            
            {
                buffs.map((cell, index) => <SnakeCell key={index} x={cell.x} y={cell.y} color={cell.color}/>)
            }
            </Layer>
        </Stage>
    </div>)
}

export default SnakeGame