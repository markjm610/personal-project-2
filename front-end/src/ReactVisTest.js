import React, { useContext } from 'react'
import { XYPlot, LineSeries, MarkSeries, XAxis, YAxis } from 'react-vis';
import '../node_modules/react-vis/dist/style.css';
import Context from './Context';

const ReactVisTest = () => {

    const { selectedPlan } = useContext(Context)

    return (
        <div className="App">
            <XYPlot height={700} width={1400} xType='time'>
                <XAxis />
                <YAxis />
                <LineSeries data={selectedPlan.graphData} />
            </XYPlot>
        </div>
    );
}

export default ReactVisTest