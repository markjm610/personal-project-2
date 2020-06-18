import React, { useState, useEffect, useContext } from 'react';
import { VictoryChart, VictoryLine, VictoryZoomContainer } from 'victory';
import apiBaseUrl from './config';
import Context from './Context';

const PlanNav = () => {

    const { graphData, setGraphData, displayedPlan } = useContext(Context);


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



        const res = await fetch(`${apiBaseUrl}/plans/5eea33997d4f345b506cd65c`)
        const parsedRes = await res.json()
        const salaries = parsedRes.salaries
        const expenses = parsedRes.expenses
        // console.log(salaries)
        let salaryDisplayArray = []
        salaries.forEach(salary => {

            // (End year - start year) * 12 + (end month - start month)

            const numberOfMonths = (salary.endDate[0] - salary.startDate[0]) * 12 + (salary.endDate[1] - salary.startDate[1])

            const startMilliseconds = new Date(salary.startDate[0], salary.startDate[1], salary.startDate[2]).getTime()

            const endMilliseconds = new Date(salary.endDate[0], salary.endDate[1], salary.endDate[2]).getTime()

            const dayDifference = (endMilliseconds - startMilliseconds) / (1000 * 60 * 60 * 24)

            const startYear = salary.startDate[0]
            const startMonth = salary.startDate[1]
            const startDay = salary.startDate[2]

            // for (let i = 1; i <= dayDifference; i++) {

            //     const y = salary.afterTaxAmount / dayDifference * i

            //     salaryDisplayArray.push({
            //         x: new Date(startYear, startMonth, i + startDay), y: y
            //     })
            // }


            // for (let i = 1; i <= dayDifference; i++) {

            //     const date = new Date(startYear, startMonth, i + startDay)
            //     displayedPlanArray.forEach((datapoint, i) => {
            //         console.log(i)
            //         if (date === datapoint.x) {
            //             console.log('date === datapoint.x')
            //         }
            //     })

            // }


            // let currentYear = salary.startDate[0]


            // for (let i = startMonth + 1; i <= startMonth + numberOfMonths; i++) {

            //     const y = salary.afterTaxAmount / numberOfMonths * (i - startMonth)

            //     // Handle end date day compared to start date day somehow

            //     salaryDisplayArray.push({
            //         x: new Date(currentYear, i, salary.startDate[2]), y: y
            //     })
            // }

        })

        // setGraphData(salaryDisplayArray)
        // console.log(expenses)
        // On the date of each expense, subtract expense amount from total y value

    }





    return (
        <>
            <button onClick={newPlan}>New Plan</button>
            <button onClick={getPlan}>Get Plan</button>
        </>
    )
}

export default PlanNav;