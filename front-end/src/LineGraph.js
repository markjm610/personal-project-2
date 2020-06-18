import React, { useState, useEffect, useContext } from 'react';
import { VictoryChart, VictoryLine, VictoryZoomContainer, VictoryCursorContainer, VictoryVoronoiContainer } from 'victory';
import apiBaseUrl from './config';
import Context from './Context';

const LineGraph = () => {

    const { selectedPlan, displayedData, setDisplayedData, displayedPlan, currentPlan } = useContext(Context)

    const [zoomDomain, setZoomDomain] = useState()
    // const [graphData, setGraphData] = useState([])



    // useEffect(() => {
    //     const fetchData = async () => {


    //         // console.log(salaries)

    //             // (End year - start year) * 12 + (end month - start month)
    //             // const numberOfMonths = (salary.endDate[0] - salary.startDate[0]) * 12 + (salary.endDate[1] - salary.startDate[1])


    //     }


    // }, [])


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
                {selectedPlan.graphData && console.log(typeof selectedPlan.graphData[0].x)}
                <VictoryLine
                    style={{
                        data: { stroke: "tomato" }
                    }}
                    data={selectedPlan.graphData}
                // x="a"
                // y="b"
                />

            </VictoryChart>

        </div >
    );

}

export default LineGraph;
