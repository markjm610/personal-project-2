import React, { useState, useEffect } from 'react';
import { VictoryChart, VictoryStack, VictoryTheme, VictoryArea } from 'victory';
import _ from 'underscore';

const GraphTest = () => {

    const [dataState, setDataState] = useState([
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 3 },
        { x: 4, y: 5 },
        { x: 5, y: 7 },
    ])
    const [bool, setBool] = useState(true)

    function changeData() {
        if (bool) {
            setDataState([
                { x: 1, y: 30 },
                { x: 2, y: 40 },
                { x: 3, y: 30 },
                { x: 4, y: 50 },
                { x: 5, y: 10 },
            ])
            setBool(false)
        } else {
            setDataState([
                { x: 1, y: 2 },
                { x: 2, y: 4 },
                { x: 3, y: 3 },
                { x: 4, y: 5 },
                { x: 5, y: 7 },
            ])
            setBool(true)
        }
    }

    useEffect(() => {
        setTimeout(changeData, 1000)
    }, [dataState])

    const data = [[
        { x: 1, y: 20 },
        { x: 2, y: 4 },
        { x: 3, y: 3 },
        { x: 4, y: 5 },
        { x: 5, y: 100 },
    ],
    [
        { x: 1, y: 30 },
        { x: 2, y: 40 },
        { x: 3, y: 30 },
        { x: 4, y: 50 },
        { x: 5, y: 10 },
    ]]

    const data2 = [
        { x: 1, y: 50 },
        { x: 2, y: 50 },
        { x: 3, y: 50 },
        { x: 4, y: 50 },
        { x: 5, y: 50 },
    ]

    const data3 = [
        { x: 1, y: 70 },
        { x: 2, y: 30 },
        { x: 3, y: 20 },
        { x: 4, y: 80 },
        { x: 5, y: 60 },
    ]

    return (
        <div className='graph-test'>
            <VictoryChart
                theme={VictoryTheme.material}
                animate={{ duration: 1000 }}
            >
                {dataState && <VictoryStack
                    colorScale={"blue"}
                >

                    <VictoryArea
                        // key={i}
                        data={dataState}
                        interpolation={"basis"}
                    />
                    <VictoryArea
                        // key={i}
                        data={data2}
                        interpolation={"basis"}
                    />
                    <VictoryArea
                        // key={i}
                        data={data3}
                        interpolation={"basis"}
                    />

                </VictoryStack>}
            </VictoryChart>
        </div>
    );
}

export default GraphTest;