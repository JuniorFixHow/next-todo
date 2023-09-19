'use client'

import { createContext, useState } from "react"

export const ThemeContext = createContext();

export const ThemeContextProvider = ({children})=>{
    const [mode, setMode] = useState('dark');
    const toggle = ()=>{
        setMode(pre=> (pre === 'light'? 'dark':'light'));
    }
    return(
        <ThemeContext.Provider value={{mode, toggle}} >
            <div style={{height:'100%',}} className={`theme ${mode}`} >{children}</div>
        </ThemeContext.Provider>
    )
}