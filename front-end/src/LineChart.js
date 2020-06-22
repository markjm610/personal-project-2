import React, { useState, useContext } from 'react'
import { XYPlot, LineSeries, XAxis, YAxis, Highlight, Crosshair } from 'react-vis';
import '../node_modules/react-vis/dist/style.css';
import Context from './Context';
import Backdrop from '@material-ui/core/Backdrop';
import AddOrView from './AddOrView';
import { makeStyles } from '@material-ui/core/styles';
import Layer from './Layer'


const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const LineChart = () => {
    const classes = useStyles();

    const { setDisableLayer, selectedPlan, setHoverData, showLayer, setShowLayer } = useContext(Context)
    const [lastDrawLocation, setLastDrawLocation] = useState(null)
    const [crosshair, setCrosshair] = useState([])

    const handleNearestX = (nearestX) => {
        setHoverData(nearestX)
        setCrosshair([nearestX])
    }

    const handleToggle = () => {
        setShowLayer(!showLayer);
        console.log('click')
    };

    const handleMouseLeave = () => {
        setCrosshair([])
    }

    return (
        <div className='graph-container'>
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
                onClick={handleToggle}
                onMouseLeave={handleMouseLeave}
                onMouseDown={() => {
                    setDisableLayer(false)
                    setShowLayer(false)
                }}

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
                    onBrush={() => {
                        console.log('on brush')
                        setDisableLayer(true)
                    }}
                    onBrushEnd={area => {
                        if (area) {
                            setLastDrawLocation(area)
                        }
                    }}
                />
                <Crosshair
                    values={crosshair}
                    className={'test-class-name'}
                />
            </XYPlot>
            <Layer />
        </div>
    );
}

export default LineChart