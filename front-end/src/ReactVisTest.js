import React, { useState, useContext } from 'react'
import { XYPlot, LineSeries, XAxis, YAxis, Highlight } from 'react-vis';
import '../node_modules/react-vis/dist/style.css';
import Context from './Context';

const ReactVisTest = () => {

    const { selectedPlan } = useContext(Context)
    const [lastDrawLocation, setLastDrawLocation] = useState(null)

    return (
        <div className="App">
            <XYPlot
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
            >
                <XAxis />
                <YAxis />
                <LineSeries data={selectedPlan.graphData} />
                <Highlight
                    onBrushEnd={area => setLastDrawLocation(area)}
                    onDrag={area => {
                        setLastDrawLocation({
                            bottom: lastDrawLocation.bottom + (area.top - area.bottom),
                            left: lastDrawLocation.left - (area.right - area.left),
                            right: lastDrawLocation.right - (area.right - area.left),
                            top: lastDrawLocation.top + (area.top - area.bottom)
                        })
                    }}
                />
            </XYPlot>
        </div>
    );
}

export default ReactVisTest