import React, { useState } from 'react';
import Context from './Context';
import App from './App';

const ContextWrapper = () => {


    const [selectedPlan, setSelectedPlan] = useState({ graphData: [] })
    const [hoverData, setHoverData] = useState([])
    const [showLayer, setShowLayer] = useState(false)
    const [disableLayer, setDisableLayer] = useState(false)
    const [openAddSalary, setOpenAddSalary] = useState(false);
    const [openAddExpense, setOpenAddExpense] = useState(false);
    const [openNewPlan, setOpenNewPlan] = useState(false);
    const [lastDrawLocation, setLastDrawLocation] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [currentUserPlans, setCurrentUserPlans] = useState([])
    const [singleMode, setSingleMode] = useState(false)
    const [expandItem, setExpandItem] = useState({})
    const [history, setHistory] = useState(null)

    return (
        <Context.Provider value={
            {
                selectedPlan, setSelectedPlan,
                hoverData, setHoverData,
                showLayer, setShowLayer,
                disableLayer, setDisableLayer,
                openAddSalary, setOpenAddSalary,
                openAddExpense, setOpenAddExpense,
                lastDrawLocation, setLastDrawLocation,
                currentUser, setCurrentUser,
                openNewPlan, setOpenNewPlan,
                currentUserPlans, setCurrentUserPlans,
                singleMode, setSingleMode,
                expandItem, setExpandItem,
                history, setHistory
            }
        } >
            <App />
        </Context.Provider >
    )
}

export default ContextWrapper;