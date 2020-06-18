import React, { useState, useEffect, useContext } from 'react';
import { VictoryChart, VictoryLine, VictoryZoomContainer } from 'victory';
import apiBaseUrl from './config';
import Context from './Context';

const PlanNav = () => {

    const { setGraphData, displayedPlan, setDisplayedPlan } = useContext(Context);


    const getPlan = async () => {
        // await fetch()
        const displayedPlanStartMilliseconds = new Date(displayedPlan.startDate[0], displayedPlan.startDate[1], displayedPlan.startDate[2]).getTime()

        const displayedPlanEndMilliseconds = new Date(displayedPlan.endDate[0], displayedPlan.endDate[1], displayedPlan.endDate[2]).getTime()

        const displayedPlanDayDifference = (displayedPlanEndMilliseconds - displayedPlanStartMilliseconds) / (1000 * 60 * 60 * 24)

        let displayedPlanArray = []
        const displayedPlanStartYear = displayedPlan.startDate[0]
        const displayedPlanStartMonth = displayedPlan.startDate[1]
        const displayedPlanStartDay = displayedPlan.startDate[2]

        for (let i = 1; i <= displayedPlanDayDifference; i++) {

            displayedPlanArray.push({
                x: new Date(displayedPlanStartYear, displayedPlanStartMonth, i + displayedPlanStartDay), y: 0
            })
        }

        setGraphData(displayedPlanArray)
    }

    return (
        <button onClick={getPlan}></button>
    )
}

export default PlanNav;