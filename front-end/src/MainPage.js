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


const MainPage = () => {

    const { setLastDrawLocation, currentUserPlans, setCurrentUserPlans, currentUser, expandItem, setExpandItem } = useContext(Context)
    const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();


    useEffect(() => {
        if (currentUser) {
            // let salaries;
            // let expenses;
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
                // setSavedItems({ salaries: salaries, expenses: expenses })

                // savedItems.salaries = salaries
                // savedItems.expenses = expenses
                // console.log(items)
                // expenses.forEach(expense => {
                //     setExpandItem({ ...expandItem, [expense._id]: false })
                // })
            }

            const getPlans = async () => {
                const res = await fetch(`${apiBaseUrl}/users/${currentUser._id}/plans`)

                const plans = await res.json()


                plans.forEach(async (plan) => {
                    await getItems(plan._id)
                    // plan.salaries = salaries
                    // plan.expenses = expenses

                })

                setCurrentUserPlans(plans)
            }
            getPlans()


        }

    }, [currentUser])

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