import React, { useState, useContext } from 'react'
import { XYPlot, LineSeries, XAxis, YAxis, Highlight, Crosshair, AreaSeries } from 'react-vis';
import '../node_modules/react-vis/dist/style.css';
import Context from './Context';
import Backdrop from '@material-ui/core/Backdrop';
import AddOrView from './AddOrView';
import { makeStyles } from '@material-ui/core/styles';
import Layer from './Layer'
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const LineChart = () => {
    const classes = useStyles();

    const { lastDrawLocation, setLastDrawLocation, setDisableLayer, selectedPlan, setHoverData, showLayer, setShowLayer } = useContext(Context)
    // const [lastDrawLocation, setLastDrawLocation] = useState(null)
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
                    console.log('mouseDown')
                    setDisableLayer(false)
                    setShowLayer(false)
                }}
            // onMouseUp={() => {
            //     console.log('mouseUp')
            //     setDisableLayer(false)
            //     // setShowLayer(false)
            // }}

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
                <AreaSeries
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

                {crosshair.length !== 0 && <Crosshair
                    values={crosshair}
                >
                    <div className='crosshair'>
                        <div>{crosshair[0].x.toString().slice(0, 15)}</div>
                        <div>${crosshair[0].y.toFixed(2)}</div>
                    </div>
                </Crosshair>}
            </XYPlot>
            <Layer />
        </div>
    );
}

export default LineChart