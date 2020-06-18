import React, { useState, useEffect, useContext } from 'react';
import { VictoryChart, VictoryLine, VictoryZoomContainer, VictoryCursorContainer, VictoryVoronoiContainer } from 'victory';
import apiBaseUrl from './config';
import Context from './Context';

const LineGraph = () => {

    const { graphData, setGraphData, displayedData, setDisplayedData, displayedPlan } = useContext(Context)

    const [zoomDomain, setZoomDomain] = useState()
    // const [graphData, setGraphData] = useState([])

    // useEffect(() => {
    //     const displayedPlanStartMilliseconds = new Date(displayedPlan.startDate[0], displayedPlan.startDate[1], displayedPlan.startDate[2]).getTime()

    //     const displayedPlanEndMilliseconds = new Date(displayedPlan.endDate[0], displayedPlan.endDate[1], displayedPlan.endDate[2]).getTime()

    //     const displayedPlanDayDifference = (displayedPlanEndMilliseconds - displayedPlanStartMilliseconds) / (1000 * 60 * 60 * 24)

    //     let displayedPlanArray = []
    //     const displayedPlanStartYear = displayedPlan.startDate[0]
    //     const displayedPlanStartMonth = displayedPlan.startDate[1]
    //     const displayedPlanStartDay = displayedPlan.startDate[2]


    //     for (let i = 1; i <= displayedPlanDayDifference; i++) {

    //         displayedPlanArray.push({
    //             x: new Date(displayedPlanStartYear, displayedPlanStartMonth, i + displayedPlanStartDay), y: 0
    //         })
    //     }

    //     setGraphData(displayedPlanArray)
    // }, [])


    useEffect(() => {
        const fetchData = async () => {
            // Will have to change this when users exist

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
                //     graphData.forEach()
                //     if (date === graphData.x) {
                //         console.log('date === graphData.x')
                //     }
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
        fetchData()

    }, [])


    return (
        <div>
            <VictoryChart width={1000} height={470} scale={{ x: "time" }}
                // containerComponent={
                //     // {/* <VictoryZoomContainer
                //     //     zoomDimension="x"
                //     //     zoomDomain={zoomDomain}
                //     // /> */}
                //     // <VictoryVoronoiContainer
                //     //     labels={({ datum }) => `${datum.y}`}
                //     // />
                // }
                containerComponent={
                    <VictoryZoomContainer
                        zoomDimension="x"
                        zoomDomain={zoomDomain}
                    />

                }
            >
                <VictoryLine
                    style={{
                        data: { stroke: "tomato" }
                    }}
                    data={graphData}
                // x="a"
                // y="b"
                />

            </VictoryChart>

        </div >
    );

}

export default LineGraph;
