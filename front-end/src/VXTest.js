import React, { useContext } from 'react';
import { LinearGradient } from '@vx/gradient';
import { AreaClosed } from '@vx/shape';
import { scaleTime, scaleLinear } from '@vx/scale';
import { extent, max } from 'd3-array';
import { appleStock } from '@vx/mock-data';
import { Group } from '@vx/group';
import { AxisLeft, AxisBottom } from '@vx/axis';
import Context from './Context';

const Graph = () => {

    // const data = appleStock;


    const { selectedPlan } = useContext(Context)

    const width = 750;
    const height = 400;

    const margin = {
        top: 60,
        bottom: 60,
        left: 80,
        right: 80,
    };

    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    const x = d => d.x; // d.date is unix timestamps
    const y = d => d.y;

    const yScale = scaleLinear({
        range: [yMax, 0],
        domain: [0, max(selectedPlan.graphData, y)],
    });



    const xScale = scaleTime({
        range: [0, xMax],
        domain: extent(selectedPlan.graphData, x)
    });


    const chart = (
        <svg width={width} height={height}>
            <Group top={margin.top} left={margin.left}>
                <AreaClosed
                    data={selectedPlan.graphData}
                    yScale={yScale}
                    // x={x}
                    // y={y}

                    x={d => xScale(x(d))}
                    y={d => yScale(y(d))}

                    fill={"url(#gradient)"}
                />
                <AxisBottom
                    scale={xScale}
                    top={yMax}
                    label={'Time'}
                    stroke={'#1b1a1e'}
                    tickTextFill={'#1b1a1e'}
                />
                <AxisLeft
                    scale={yScale}
                    top={0}
                    left={0}
                    label={'Total ($)'}
                    stroke={'#1b1a1e'}
                    tickTextFill={'#1b1a1e'}
                />
                <LinearGradient
                    from='#fbc2eb'
                    to='#a6c1ee'
                    id='gradient'
                />
            </Group>
        </svg>
    )
    return chart
}

export default Graph