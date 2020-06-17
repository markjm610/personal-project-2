import React, { useState, useEffect, useContext } from 'react';
import { VictoryChart, VictoryLine, VictoryZoomContainer } from 'victory';
import apiBaseUrl from './config';
import Context from './Context';

const PlanNav = () => {

    const { displayedPlan, setDisplayedPlan } = useContext(Context);

    const getPlan = async () => {
        // await fetch()
    }

    return (
        <button onClick={getPlan}></button>
    )
}

export default PlanNav;