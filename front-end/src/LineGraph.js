import React, { useState, useEffect, useContext } from 'react';
import { VictoryChart, VictoryLine, VictoryZoomContainer } from 'victory';
import apiBaseUrl from './config';
import Context from './Context';

const LineGraph = () => {

    const { displayedData, setDisplayedData, displayedPlan } = useContext(Context)

    const [zoomDomain, setZoomDomain] = useState()
    const [graphData, setGraphData] = useState([
        { x: new Date(2020, 12, 1), y: 270 },
        { x: new Date(2020, 6, 1), y: 300 }
    ])

    useEffect(() => {
        const fetchData = async () => {
            // Will have to change this when users exist

            const res = await fetch(`${apiBaseUrl}/plans/5eea33997d4f345b506cd65c`)
            const parsedRes = await res.json()
            const salaries = parsedRes.salaries
            const expenses = parsedRes.expenses
            console.log(salaries)

            const salaryDisplayArray = salaries.map(salary => {
                // Have to get number of months, then loop over each month probably with regular for loop
                // (End year - start year) * 12 + (end month - start month)

                return {
                    // x: every month from start date to end date, y: (salary.afterTaxAmount / number of months) * (i + 1)
                }
            })

            setGraphData(salaryDisplayArray)
            // afterTaxAmount: 24000
            // amountPerYear: 30000
            // endDate: "2021-06-17T04:00:00.000Z"
            // name: "Salary"
            // planId: "5eea33997d4f345b506cd65c"
            // startDate: "2020-07-17T04:00:00.000Z"
            // taxRate: 0.2

            console.log(expenses)
            // setGraphData(salary.afterTaxAmount)
        }
        fetchData()

    }, [])


    return (
        <div>
            <VictoryChart width={1000} height={470} scale={{ x: "time" }}
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

        </div>
    );

}

export default LineGraph;
