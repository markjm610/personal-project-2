import React, { useState, useEffect, useContext } from 'react';
import { VictoryChart, VictoryLine, VictoryZoomContainer } from 'victory';
import apiBaseUrl from './config';
import Context from './Context';

const PlanNav = () => {

    const { graphData, setGraphData, displayedPlan, setSelectedPlan } = useContext(Context);


    const newPlan = async () => {
        const res = await fetch(`${apiBaseUrl}/plans`, {
            method: 'POST',
            body: JSON.stringify({
                name: 'Test Plan', startDate: [2020, 1, 1], endDate: [2024, 1, 1]
            }),
            headers: {
                "Content-Type": 'application/json',
            }
        })

        const parsedRes = await res.json()
        console.log(parsedRes)
    }
    const getPlan = async () => {
        // await fetch(`${apiBaseUrl}/users/userId/plans`)



        const res = await fetch(`${apiBaseUrl}/plans/${displayedPlan.id}`)
        const plan = await res.json()

        // console.log(typeof plan.graphData[0].x)
        const dateObjData = plan.graphData.map(datapoint => {
            return { x: new Date(datapoint.x), y: datapoint.y }
        })

        plan.graphData = dateObjData

        setSelectedPlan(plan)

    }


    return (
        <>
            <button onClick={newPlan}>New Plan</button>
            <button onClick={getPlan}>Get Plan</button>
        </>
    )
}

export default PlanNav;