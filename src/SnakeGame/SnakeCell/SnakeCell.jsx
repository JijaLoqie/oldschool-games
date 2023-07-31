import { useState } from "react"
import styles from "./SnakeCell.module.css"
import {Rect} from 'react-konva'

export const CELL_SIZE = 30

export const SnakeCell = ({x, y, color}) => {

    return <Rect
        x={x*CELL_SIZE}
        y={y*CELL_SIZE}
        width={CELL_SIZE}
        height={CELL_SIZE}
        fill={color}
        shadowBlur={10}
    />
}
