import {Stage, Layer, Text, Rect, Circle, Line} from 'react-konva'


import styles from "./SaperGame.module.css"
import { useEffect, useState } from 'react'
import { isEqual, random } from 'lodash'
import { SaperCell, CELL_SIZE } from './SaperCell/SaperCell'




export const SaperGame = ({mouseCoords, center, handleGoBack}) => {
    const [loose, setLoose] = useState(false)
    const [bombs, setBombs] = useState([])
    const [revealedCells, setRevealedCells] = useState([])
    const [marks, setMarks] = useState([])

    const getCell = (coords) => {
        return {x: Math.floor((coords.x + center.x) / CELL_SIZE), y: Math.floor((coords.y + center.y) / CELL_SIZE)}
    }

    function contains(a, obj) {
        for (var i = 0; i < a.length; i++) {
            if (a[i].x === obj.x && a[i].y === obj.y) {
                return true;
            }
        }
        return false;
    }
    const getRevealedCell = (cell) => {
        let countBombs = 0
        if (contains(bombs, {x: cell.x - 1, y: cell.y})) {
            countBombs += 1
        }
        if (contains(bombs, {x: cell.x + 1, y: cell.y})) {
            countBombs += 1
        }
        if (contains(bombs, {x: cell.x - 1, y: cell.y - 1})) {
            countBombs += 1
        }
        if (contains(bombs, {x: cell.x + 1, y: cell.y - 1})) {
            countBombs += 1
        }
        if (contains(bombs, {x: cell.x - 1, y: cell.y + 1})) {
            countBombs += 1
        }
        if (contains(bombs, {x: cell.x + 1, y: cell.y + 1})) {
            countBombs += 1
        }
        if (contains(bombs, {x: cell.x, y: cell.y + 1})) {
            countBombs += 1
        }
        if (contains(bombs, {x: cell.x, y: cell.y - 1})) {
            countBombs += 1
        }
        return {x: cell.x, y: cell.y, countBombs: countBombs}
    }

    useEffect(() => {
        const isOut = ({x, y}) => {
            if (x < 0 || y < 0) {
                return true;
            }

            if (x > Math.floor(window.innerWidth / CELL_SIZE) || y > Math.floor(window.innerHeight / CELL_SIZE)) {
                return true
            }

            return false
        }
        const unrevealedNear = (curCell) => {
            var found = false;
            
            var cell = {x: curCell.x - 1, y: curCell.y - 1}
            if (!contains(revealedCells, cell) && !isOut(cell)) {
                found = true
                return {found: found, cell: cell}
            }
            var cell = {x: curCell.x + 1, y: curCell.y - 1}
            if (!contains(revealedCells, cell) && !isOut(cell)) {
                found = true
                return {found: found, cell: cell}
            }
            var cell = {x: curCell.x - 1, y: curCell.y + 1}
            if (!contains(revealedCells, cell) && !isOut(cell)) {
                found = true
                return {found: found, cell: cell}
            }
            var cell = {x: curCell.x + 1, y: curCell.y + 1}
            if (!contains(revealedCells, cell) && !isOut(cell)) {
                found = true
                return {found: found, cell: cell}
            }
            var cell = {x: curCell.x - 1, y: curCell.y}
            if (!contains(revealedCells, cell) && !isOut(cell)) {
                found = true
                return {found: found, cell: cell}
            }
            var cell = {x: curCell.x + 1, y: curCell.y}
            if (!contains(revealedCells, cell) && !isOut(cell)) {
                found = true
                return {found: found, cell: cell}
            }
            var cell = {x: curCell.x, y: curCell.y - 1}
            if (!contains(revealedCells, cell) && !isOut(cell)) {
                found = true
                return {found: found, cell: cell}
            }
            var cell = {x: curCell.x, y: curCell.y + 1}
            if (!contains(revealedCells, cell) && !isOut(cell)) {
                found = true
                return {found: found, cell: cell}
            }

            return {found: found, cell: null}
        }

        for (let i = 0; i < revealedCells.length; i++) {
            const res = unrevealedNear(revealedCells[i])
            if (revealedCells[i].countBombs == 0 && res.found) {
                const newCell = getRevealedCell(res.cell)

                setMarks(oldMarks => oldMarks.filter((mark) => !isEqual(mark, {x: newCell.x, y: newCell.y})))
                setRevealedCells(oldRevealedCells => [...oldRevealedCells, newCell])
                break
            }
        }



    }, [revealedCells])

    const handleRightClick = (coords) => {
        const clickCell = getCell(coords)
        const newMark = {x: clickCell.x, y: clickCell.y}
        if (contains(marks, newMark)) {
            setMarks(oldMarks => oldMarks.filter((mark) => !isEqual(mark, newMark)))
        } else {
            setMarks(oldMarks => [...oldMarks, newMark])
        }
    
    }
    const handleClick = (type, coords) => {
        const clickCell = getCell(coords)
        if (contains(revealedCells, clickCell)) {
            return
        }
        if (type === 2) {
            handleRightClick(coords)
            return
        }
        if (contains(bombs, clickCell)) {
            setLoose(true)
            return;
        }

        const newCell = getRevealedCell(clickCell)
        setMarks(oldMarks => oldMarks.filter((mark) => !isEqual(mark, {x: newCell.x, y: newCell.y})))
        setRevealedCells(oldRevealedCells => [...oldRevealedCells, newCell])

    }

    useEffect(() => {
        // bomb init
        for (let i = 0; i < 20; i++) {
            setBombs(oldBombs => [...oldBombs, {x: random(0, Math.floor(window.innerWidth / CELL_SIZE)), y: random(0, Math.floor(window.innerHeight / CELL_SIZE))}])
        }

    }, [])
    return ( <div className={styles.SaperGame}>
    <Stage width={window.innerWidth} height={window.innerHeight} onClick={(e) => handleClick(e.evt.button, mouseCoords)}>
            <Layer>
            {loose ? 
            <Text className={styles.LooseText} text="YOU LOOSE" fontSize={30} fill="red" onClick={handleGoBack} 
            height={window.innerHeight}
            width={window.innerWidth}
            verticalAlign='middle'
            align="center"
            
                />
                :
                revealedCells.map((cell, index) => <SaperCell key={index} x={cell.x} y={cell.y} color="#ce5f5f" text={cell.countBombs}/>)
            }
            {marks.map((cell, index) => <SaperCell key={index} x={cell.x} y={cell.y} text="!" color="red"/>)}
            </Layer>
        </Stage></div>)
}