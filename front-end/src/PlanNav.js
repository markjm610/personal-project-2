import React, { useState, useEffect, useContext } from 'react';
import { VictoryChart, VictoryLine, VictoryZoomContainer } from 'victory';
import apiBaseUrl from './config';
import Context from './Context';
import Button from '@material-ui/core/Button';


const PlanNav = ({ id, name }) => {

    const { graphData, setGraphData, setSelectedPlan, currentUser } = useContext(Context);

    const getPlan = async () => {
        // await fetch(`${apiBaseUrl}/users/userId/plans`)



        const res = await fetch(`${apiBaseUrl}/plans/${id}`)
        const plan = await res.json()


        const dateObjData = plan.graphData.map(datapoint => {
            return { x: new Date(datapoint.x), y: datapoint.y }
        })

        plan.graphData = dateObjData

        setSelectedPlan(plan)

    }


    return (
        <>
            <Button color="inherit" onClick={getPlan}>{name}</Button>

        </>
    )
}

export default PlanNav;