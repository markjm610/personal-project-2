import React, { useEffect, useContext } from 'react';
import PlanNav from './PlanNav';
import LineChart from './LineChart'
import TopBar from './TopBar'
import apiBaseUrl from './config';
import Context from './Context';
import AddSalaryNav from './AddSalaryNav';
import BelowGraph from './BelowGraph';
import Sidebar from './Sidebar';

const MainPage = () => {

    return (
        <>
            <TopBar />
            <div className='middle'>
                <Sidebar />
                <div className='chart-and-buttons'>
                    <LineChart />
                    <BelowGraph />
                </div>
            </div>
        </>
    )
}

export default MainPage