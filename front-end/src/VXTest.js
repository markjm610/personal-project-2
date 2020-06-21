import React, { useContext, useState } from 'react';
import { Zoom } from '@vx/zoom';
import { LinearGradient } from '@vx/gradient';
import { AreaClosed } from '@vx/shape';
import { scaleTime, scaleLinear } from '@vx/scale';
import { extent, max } from 'd3-array';
import { Group } from '@vx/group';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { RectClipPath } from '@vx/clip-path';
import { localPoint } from '@vx/event';
import { useTooltip, TooltipWithBounds } from '@vx/tooltip';
import Context from './Context';

const Graph = () => {

    // const data = appleStock;
    const [showMiniMap, setShowMiniMap] = useState(true);

    const {
        tooltipData,
        tooltipLeft,
        tooltipTop,
        tooltipOpen,
        showTooltip,
        hideTooltip,
    } = useTooltip();

    const handleMouseOver = (event, datum) => {
        const coords = localPoint(event.target.ownerSVGElement, event);
        console.log(event)
        showTooltip({
            tooltipLeft: coords.x,
            tooltipTop: coords.y,
            tooltipData: datum
        });
    };


    const { selectedPlan } = useContext(Context)

    const width = 1400;
    const height = 700;

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



    const initialTransform = {
        scaleX: 1.27,
        scaleY: 1.27,
        translateX: -211.62,
        translateY: 162.59,
        skewX: 0,
        skewY: 0,
    };

    const bg = '#0a0a0a';

    return (

        <svg width={width} height={height}>


            <Group>
                <AreaClosed
                    data={selectedPlan.graphData}
                    yScale={yScale}
                    // x={x}
                    // y={y}

                    x={d => xScale(x(d))}
                    y={d => yScale(y(d))}

                    fill={"url(#gradient)"}

                    // onMouseMove={(event) => {
                    //     const point = localPoint(event) || { x: 0, y: 0 };
                    //     console.log(point)
                    // }}

                    onMouseMove={handleMouseOver}
                    // onMouseOver={handleMouseOver}
                    onMouseOut={hideTooltip}


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
}

export default Graph