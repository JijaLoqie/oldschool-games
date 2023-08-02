import { useState } from "react"
import {Rect} from 'react-konva'

export const CELL_SIZE = 30

export const TetrisCell = ({x, y, color}) => {

    return <Rect
        x={x*CELL_SIZE}
        y={y*CELL_SIZE}
        width={CELL_SIZE}
        height={CELL_SIZE}
        fill={color}
        shadowBlur={10}
    />
}
