import React, { useState } from 'react';
import Context from './Context';
import App from './App';

const ContextWrapper = () => {


    const [displayedData, setDisplayedData] = useState(null)
    const [displayedPlan, setDisplayedPlan] = useState({
        name: 'Test Plan',
        id: '5eebbcfa580bab355956ea30',
        startDate: [2020, 5, 20],
        endDate: [2025, 3, 10]
    })
    const [selectedPlan, setSelectedPlan] = useState({})
    return (
        <Context.Provider value={
            {
                displayedData, setDisplayedData,
                displayedPlan, setDisplayedPlan,
                selectedPlan, setSelectedPlan
            }
        } >
            <App />
        </Context.Provider >
    )
}

export default ContextWrapper;