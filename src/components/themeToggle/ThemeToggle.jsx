import React, { useContext } from 'react'
import styles from './themeToggle.module.css';
import { ThemeContext } from '@/context/ThemeContext';


const ThemeToggle = () => {
    const {mode, toggle} = useContext(ThemeContext);
  return (
    <div onClick={toggle} className={styles.toggle} >
        <div className={styles.icon} >🔆</div>
        <div className={styles.icon} >🌒</div>
        <div className={styles.circle} style={
            mode === 'light' ? {left:'0.2rem'} : {right:'0.2rem'}
        } />
    </div>
  )
}

export default ThemeToggle