import React, { useState } from 'react';
import Context from './Context';
import App from './App';

const ContextWrapper = () => {


    const [displayedData, setDisplayedData] = useState(null)
    const [displayedPlan, setDisplayedPlan] = useState({
        name: 'Test Plan',
        id: '5eed1cc81fc15b6cb97e29c7',
        startDate: [2020, 5, 20],
        endDate: [2025, 3, 10]
    })
    const [selectedPlan, setSelectedPlan] = useState({ graphData: [] })
    const [hoverData, setHoverData] = useState([])
    const [showLayer, setShowLayer] = useState(false)
    const [disableLayer, setDisableLayer] = useState(false)
    const [openAddSalary, setOpenAddSalary] = useState(false);
    const [openAddExpense, setOpenAddExpense] = useState(false);
    const [lastDrawLocation, setLastDrawLocation] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)


    return (
        <Context.Provider value={
            {
                displayedData, setDisplayedData,
                displayedPlan, setDisplayedPlan,
                selectedPlan, setSelectedPlan,
                hoverData, setHoverData,
                showLayer, setShowLayer,
                disableLayer, setDisableLayer,
                openAddSalary, setOpenAddSalary,
                openAddExpense, setOpenAddExpense,
                lastDrawLocation, setLastDrawLocation,
                currentUser, setCurrentUser
            }
        } >
            <App />
        </Context.Provider >
    )
}

export default ContextWrapper;