import { useState } from "react"
import styles from "./SaperCell.module.css"
import {Rect, Text, Stage, Layer} from 'react-konva'
import { isEqual } from 'lodash'

export const CELL_SIZE = 30

export const SaperCell = ({x, y, color, text}) => {

    return <>{isEqual(text, 0)
    ? <Rect
        fill="#c33c3c"
        x={x*CELL_SIZE}
        y={y*CELL_SIZE}
        width={CELL_SIZE}
        height={CELL_SIZE}
        shadowBlur={10}
    /> 
    : <Text
        fontSize={CELL_SIZE}
        text={text}
        stroke={color}
        strokeWidth={5}
        align="center"
        x={x*CELL_SIZE}
        y={y*CELL_SIZE}
    />}</>
}
