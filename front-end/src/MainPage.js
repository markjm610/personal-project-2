import React, { useEffect, useContext } from 'react';
import PlanNav from './PlanNav';
import LineChart from './LineChart'
import TopBar from './TopBar'
import apiBaseUrl from './config';
import Context from './Context';

const MainPage = () => {

    return (
        <>
            <TopBar />
            <LineChart />
        </>
    )
}

export default MainPage