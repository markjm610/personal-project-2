import React, { useState, useContext } from 'react'
import { XYPlot, LineSeries, XAxis, YAxis, Highlight, Voronoi, Crosshair } from 'react-vis';
import '../node_modules/react-vis/dist/style.css';
import Context from './Context';

const ReactVisTest = () => {

    const { selectedPlan, setHoverData } = useContext(Context)
    const [lastDrawLocation, setLastDrawLocation] = useState(null)

    const handleNearestX = (nearestX) => {
        setHoverData(nearestX)
        return
    }


    return (
        <div className="App">
            <XYPlot
                animation={true}
                height={700}
                width={1400}
                xType='time'
                animation
                xDomain={
                    lastDrawLocation && [
                        lastDrawLocation.left,
                        lastDrawLocation.right
                    ]
                }
                yDomain={
                    lastDrawLocation && [
                        lastDrawLocation.bottom,
                        lastDrawLocation.top
                    ]
                }
            // onClick={e => console.log(e)}

            >
                <XAxis
                    animation
                    style={{
                        userSelect: 'none'
                    }}
                />
                <YAxis
                    animation
                    style={{
                        userSelect: 'none'
                    }}
                />
                <LineSeries
                    data={selectedPlan.graphData}
                    onNearestX={handleNearestX}
                />
                <Highlight
                    onBrushEnd={area => {
                        if (area) {
                            setLastDrawLocation(area)
                        }

                    }}
                    onDrag={area => {
                        setLastDrawLocation({
                            bottom: lastDrawLocation.bottom + (area.top - area.bottom),
                            left: lastDrawLocation.left - (area.right - area.left),
                            right: lastDrawLocation.right - (area.right - area.left),
                            top: lastDrawLocation.top + (area.top - area.bottom)
                        })
                    }}
                />
                {/* <Voronoi
                    // extent={[[0, 0], [200, 200]]}
                    nodes={selectedPlan.graphData}
                    onHover={(e) => console.log(e)}
                // x={d => x(d.x)}
                // y={d => y(d.y)}
                /> */}

            </XYPlot>
        </div>
    );
}

export default ReactVisTest