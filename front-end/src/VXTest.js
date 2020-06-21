import React from 'react';
import { AreaClosed } from '@vx/shape';
import { scaleTime, scaleLinear } from '@vx/scale';
import { extent, max } from 'd3-array';
import { appleStock } from '@vx/mock-data';
import { Group } from '@vx/group';

const Graph = () => {

    const data = appleStock;

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

    const x = d => new Date(d.date); // d.date is unix timestamps
    const y = d => d.close;

    const yScale = scaleLinear({
        range: [yMax, 0],
        domain: [0, max(data, y)],
    });



    const xScale = scaleTime({
        range: [0, xMax],
        domain: extent(data, x)
    });


    const chart = (
        <svg width={width} height={height}>
            <Group top={margin.top} left={margin.left}>
                <AreaClosed
                    data={data}
                    xScale={xScale}
                    yScale={yScale}
                    // x={x}
                    // y={y}

                    x={d => xScale(x(d))}
                    y={d => yScale(y(d))}

                    fill={"red"}
                />
            </Group>
        </svg>
    )
    return chart
}

export default Graph