import React, { useState } from 'react';
import Context from './Context';
import App from './App';

const ContextWrapper = () => {


    const [displayedData, setDisplayedData] = useState(null)
    const [displayedPlan, setDisplayedPlan] = useState({
        name: 'Plan 1',
        id: '5eea33997d4f345b506cd65c',
        startDate: [2020, 5, 20],
        endDate: [2025, 3, 10]
    })
    const [graphData, setGraphData] = useState([])
    return (
        <Context.Provider value={
            {
                displayedData, setDisplayedData,
                displayedPlan, setDisplayedPlan,
                graphData, setGraphData
            }
        } >
            <App />
        </Context.Provider >
    )
}

export default ContextWrapper;