import { useEffect, useState } from 'react';
import styles from './Circle.module.css'


const Circle = ({ angle }) => {
    

    return <div className={styles.BigCircle}>
            <div className={styles.Segment} style={{
                transform: `rotate(${angle}rad)`,
            }}>
                <div className={styles.SmallCircle}>
                    JijaLoqie
                </div>
            </div>
    </div>
}

export default Circle