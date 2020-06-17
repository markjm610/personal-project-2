import React, { useState } from 'react';
import Context from './Context';
import App from './App';

const ContextWrapper = () => {

    const [displayedData, setDisplayedData] = useState(null)
    const [displayedPlan, setDisplayedPlan] = useState({ name: 'Plan 1', id: '5eea33997d4f345b506cd65c' })
    return (
        <Context.Provider value={
            {
                displayedData, setDisplayedData,
                displayedPlan, setDisplayedPlan
            }
        } >
            <App />
        </Context.Provider >
    )
}

export default ContextWrapper;