import React, { useEffect, useContext } from 'react';
import PlanNav from './PlanNav';
import LineChart from './LineChart'
import TopBar from './TopBar'
import apiBaseUrl from './config';
import Context from './Context';
import AddSalaryNav from './AddSalaryNav';
import BelowGraph from './BelowGraph';
import Sidebar from './Sidebar';
import { useAuth0 } from "./react-auth0-spa";
import Instructions from './Instructions';


const MainPage = ({ history }) => {

    const { selectedPlan, setSelectedPlan, setHistory, currentUserPlans, setCurrentUserPlans, currentUser, expandItem, setExpandItem } = useContext(Context)
    const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

    useEffect(() => {
        setHistory(history)
    }, [])

    useEffect(() => {
        if (currentUser) {

            let itemsObj = {}
            const getItems = async (planId) => {
                const res = await fetch(`${apiBaseUrl}/plans/${planId}/items`)
                const items = await res.json()
                const salaries = [...items.salaries]
                const expenses = [...items.expenses]
                salaries.forEach(salary => {
                    itemsObj[salary._id] = false
                })
                expenses.forEach(expense => {
                    itemsObj[expense._id] = false
                })

                setExpandItem(itemsObj)

            }

            const getPlans = async () => {
                const res = await fetch(`${apiBaseUrl}/users/${currentUser._id}/plans`)

                const plans = await res.json()


                plans.forEach(async (plan) => {
                    await getItems(plan._id)


                })

                setCurrentUserPlans(plans)
            }
            getPlans()


        }

    }, [currentUser])

    // useEffect(() => {
    //     if (currentUserPlans.length) {
    //         async function getFirstPlan() {

    //             const res = await fetch(`${apiBaseUrl}/plans/${currentUserPlans[0]._id}`)
    //             const plan = await res.json()


    //             const dateObjData = plan.graphData.map(datapoint => {
    //                 const date = new Date(datapoint.x)
    //                 const dateToAdd = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    //                 return { x: dateToAdd, y: datapoint.y }
    //             })


    //             plan.graphData = dateObjData

    //             setSelectedPlan(plan)
    //         }
    //         getFirstPlan()
    //     }
    // }, [currentUserPlans])

    return (
        <>
            <TopBar />

            {selectedPlan._id ?
                <div className='middle'>
                    <Sidebar />
                    <div className='chart-and-buttons'>
                        <LineChart />
                        <BelowGraph />
                    </div>
                </div>
                :
                <>
                    <Instructions />
                </>
            }



        </>
    )
}

export default MainPage