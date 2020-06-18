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
            // console.log(salaries)
            let salaryDisplayArray = []
            salaries.forEach(salary => {
                // Have to get number of months, then loop over each month with regular for loop
                // (End year - start year) * 12 + (end month - start month)
                const startingMonth = salary.startDate[1]
                const numberOfMonths = (salary.endDate[0] - salary.startDate[0]) * 12 + (salary.endDate[1] - salary.startDate[1])


                let currentYear = salary.startDate[0]

                for (let i = startingMonth + 1; i <= startingMonth + numberOfMonths; i++) {

                    const y = salary.afterTaxAmount / numberOfMonths * (i - startingMonth)

                    // Handle end date somehow

                    salaryDisplayArray.push({
                        x: new Date(currentYear, i, salary.startDate[2]), y: y
                    })
                }

            })

            setGraphData(salaryDisplayArray)

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
