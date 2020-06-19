import React, { useState } from 'react';
import Context from './Context';
import App from './App';

const ContextWrapper = () => {


    const [displayedData, setDisplayedData] = useState(null)
    const [displayedPlan, setDisplayedPlan] = useState({
        name: 'Test Plan',
        id: '5eebe90ddcfd8c4544f58223',
        startDate: [2020, 5, 20],
        endDate: [2025, 3, 10]
    })
    const [selectedPlan, setSelectedPlan] = useState({ graphData: [] })
    const [hoverData, setHoverData] = useState([])


    return (
        <Context.Provider value={
            {
                displayedData, setDisplayedData,
                displayedPlan, setDisplayedPlan,
                selectedPlan, setSelectedPlan,
                hoverData, setHoverData
            }
        } >
            <App />
        </Context.Provider >
    )
}

export default ContextWrapper;