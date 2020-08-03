import React, { useState, useEffect, useContext } from 'react';
import { VictoryChart, VictoryLine, VictoryZoomContainer } from 'victory';
import apiBaseUrl from './config';
import Context from './Context';
import Button from '@material-ui/core/Button';
import { Tab } from '@material-ui/core';


const PlanNav = ({ id, name, setSelectedTab, i }) => {

    const { setSelectedPlan } = useContext(Context);

    const getPlan = async () => {


        setSelectedTab(i)

        const res = await fetch(`${apiBaseUrl}/plans/${id}`)
        const plan = await res.json()

        const dateObjData = plan.graphData.map(datapoint => {
            const date = new Date(datapoint.x)
            const dateToAdd = new Date(date.getFullYear(), date.getMonth(), date.getDate())
            return { x: dateToAdd, y: datapoint.y }
        })

        plan.graphData = dateObjData

        setSelectedPlan(plan)

    }


    return (
        <Tab
            onClick={getPlan}
            label={name}
            textColor='primary'
        />

    )
}

export default PlanNav;