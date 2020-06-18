import React, { useState, useEffect, useContext } from 'react';
import { VictoryChart, VictoryLine, VictoryZoomContainer } from 'victory';
import apiBaseUrl from './config';
import Context from './Context';

const LineGraph = () => {

    const { displayedData, setDisplayedData, displayedPlan } = useContext(Context)

    const [zoomDomain, setZoomDomain] = useState()

    useEffect(() => {
        const fetchData = async () => {
            // Will have to change this when users exist

            // const res = await fetch(`${apiBaseUrl}/plans/5eea33997d4f345b506cd65c`)
            // const parsedRes = await res.json()
            // const salary = parsedRes.salaries[0]
            // const expenses = parsedRes.expenses
            // console.log(salary)
            // console.log(expenses)

        }
        // fetchData()

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
                    data={[
                        { a: new Date(2020, 12, 1), b: 270 },
                        { a: new Date(2020, 6, 1), b: 300 }
                    ]}
                    x="a"
                    y="b"
                />

            </VictoryChart>

        </div>
    );

}

export default LineGraph;
