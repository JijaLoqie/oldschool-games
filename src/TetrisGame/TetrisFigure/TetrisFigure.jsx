import { useEffect, useState } from "react"
import { TetrisCell } from "../TetrisCell/TetrisCell"


export const TetrisFigure = ({cells, position, rotation}) => {
    const [coords, setCoords] = useState([])
    useEffect(() => {
        setCoords(cells.map((cell) => {return {x: cell.x + position.x, y: cell.y + position.y}}))
    }, [cells, position])
    return <>
        {coords.map((cell, index) => <TetrisCell key={index} x={cell.x} y={cell.y} color="#c33c3c"/>)}
    </>
}
