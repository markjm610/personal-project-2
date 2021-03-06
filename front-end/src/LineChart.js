import React, { useState, useContext, useEffect } from 'react'
import { XYPlot, LineSeries, XAxis, YAxis, Highlight, Crosshair, AreaSeries } from 'react-vis';
import '../node_modules/react-vis/dist/style.css';
import Context from './Context';
import Backdrop from '@material-ui/core/Backdrop';
import AddOrView from './AddOrView';
import { makeStyles } from '@material-ui/core/styles';
import Layer from './Layer'
import Button from '@material-ui/core/Button';
import { ItemTypes } from './ItemTypes';
import { useDrag, useDrop } from 'react-dnd';
import { apiBaseUrl } from './config';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const LineChart = () => {
    const classes = useStyles();

    const {
        setSelectedPlan,
        lastDrawLocation,
        setLastDrawLocation,
        setDisableLayer,
        selectedPlan,
        setHoverData,
        showLayer,
        setShowLayer,
        singleMode,
        setSingleMode,
        disableLayer,
        setExpandItem,
        expandItem
    } = useContext(Context)

    const [crosshair, setCrosshair] = useState([])
    const [brushCounter, setBrushCounter] = useState(0)
    const [backdrop, setBackdrop] = useState(false)


    const handleNearestX = (nearestX) => {
        setHoverData(nearestX)
        setCrosshair([nearestX])
    }

    const handleToggle = async () => {
        if (singleMode && !disableLayer) {
            setSingleMode(false)
            setBackdrop(true)
            const res = await fetch(`${apiBaseUrl}/plans/${selectedPlan._id}`)
            if (res.ok) {
                const plan = await res.json()


                const dateObjData = plan.graphData.map(datapoint => {
                    return { x: new Date(datapoint.x), y: datapoint.y }
                })

                plan.graphData = dateObjData

                setBackdrop(false)
                setSelectedPlan(plan)
                setLastDrawLocation(null)
            }

        } else {
            setShowLayer(!showLayer);
        }

    };

    const handleMouseLeave = () => {
        setCrosshair([])
    }

    const handleDrop = (item) => {

        if (item.salary) {

            const planCopy = { ...selectedPlan }
            const graphDataCopy = planCopy.graphData

            const graphDataArr = graphDataCopy.map(({ x, y }) => {
                return { x, y: 0 }
            })

            const startDateObj = new Date(item.currentStartDateArr[0], item.currentStartDateArr[1], item.currentStartDateArr[2])

            let firstDayIndex;

            graphDataArr.forEach((datapoint, i) => {
                if (datapoint.x.getTime() === startDateObj.getTime()) {
                    firstDayIndex = i
                }
            })

            const startMilliseconds = startDateObj.getTime()
            const endMilliseconds = new Date(item.currentEndDateArr[0], item.currentEndDateArr[1], item.currentEndDateArr[2]).getTime()

            const dayDifference = (endMilliseconds - startMilliseconds) / (1000 * 60 * 60 * 24)

            let daysPassed = 0

            for (let i = firstDayIndex; i < graphDataArr.length; i++) {

                if (i < firstDayIndex + dayDifference) {
                    // For every day in salary period, add that day's proportion of salary to total
                    daysPassed++

                    const amountToAdd = item.currentAfterTaxAmount / 365 * daysPassed

                    graphDataArr[i].y += amountToAdd
                } else {
                    // Once salary period is over, add full amount every day to total
                    graphDataArr[i].y += item.currentAfterTaxAmount / 365 * daysPassed
                }


            }

            planCopy.graphData = graphDataArr
            setSelectedPlan(planCopy)
            setSingleMode(true)

            let expandObj = { ...expandItem }

            for (const id in expandObj) {
                if (id === item.id) {

                    expandObj[id] = true
                } else {

                    expandObj[id] = false
                }
            }

            setExpandItem(expandObj)

        } else if (item.expense) {
            const planCopy = { ...selectedPlan }
            const graphDataCopy = planCopy.graphData

            const currentDate = item.currentDate
            const currentAmount = item.currentAmount
            const repeatingInterval = item.repeatingInterval

            const graphDataArr = graphDataCopy.map(({ x, y }) => {
                return { x, y: 0 }
            })

            const dateObj = new Date(currentDate[0], currentDate[1], currentDate[2])
            const dateMilliseconds = dateObj.getTime()

            let firstDayIndex;

            graphDataArr.forEach((datapoint, i) => {
                if (datapoint.x.getTime() === dateMilliseconds) {
                    firstDayIndex = i
                }
            })

            if (!repeatingInterval) {
                for (let i = firstDayIndex; i < graphDataArr.length; i++) {
                    graphDataArr[i].y -= currentAmount
                }
            } else if (repeatingInterval === 'Daily') {
                let daysPassed = 0
                for (let i = firstDayIndex; i < graphDataArr.length; i++) {
                    daysPassed++
                    graphDataArr[i].y -= (currentAmount * daysPassed)
                }
            } else if (repeatingInterval === 'Weekly') {
                let weeksPassed = 0
                for (let i = firstDayIndex; i < graphDataArr.length; i++) {
                    if ((i - firstDayIndex) % 7 === 0) {
                        weeksPassed++
                    }

                    graphDataArr[i].y -= (currentAmount * weeksPassed)
                }

            } else if (repeatingInterval === 'Monthly') {

                const day = dateObj.getDate()

                let monthsPassed = 0
                let currentMonth = dateObj.getMonth()
                let foundDayInMonth = false

                for (let i = firstDayIndex; i < graphDataArr.length; i++) {

                    if (graphDataArr[i].x.getMonth() !== currentMonth) {
                        // Update month

                        currentMonth = graphDataArr[i].x.getMonth()
                        foundDayInMonth = false
                    }

                    if (graphDataArr[i].x.getMonth() === currentMonth && graphDataArr[i].x.getDate() === day) {
                        monthsPassed++
                        foundDayInMonth = true;
                    }

                    if (graphDataArr[i + 1] && graphDataArr[i].x.getMonth() !== graphDataArr[i + 1].x.getMonth() && !foundDayInMonth) {
                        monthsPassed++
                    }

                    graphDataArr[i].y -= (currentAmount * monthsPassed)

                }

            } else if (repeatingInterval === 'Yearly') {


                const day = dateObj.getDate()
                const month = dateObj.getMonth()
                let yearsPassed = 0
                for (let i = firstDayIndex; i < graphDataArr.length; i++) {

                    if (graphDataArr[i].x.getMonth() === month && graphDataArr[i].x.getDate() === day) {
                        yearsPassed++
                    }

                    if (month === 1 && day === 29 && graphDataArr[i].x.getMonth() === 1) {

                        if (graphDataArr[i + 1]
                            && graphDataArr[i].x.getMonth() !== graphDataArr[i + 1].x.getMonth()
                            && graphDataArr[i].x.getDate() === 28) {

                            yearsPassed++
                        }
                    }

                    graphDataArr[i].y -= (currentAmount * yearsPassed)

                }
            }

            planCopy.graphData = graphDataArr
            setSelectedPlan(planCopy)
            setSingleMode(true)

            let expandObj = { ...expandItem }

            for (const id in expandObj) {
                if (id === item.id) {

                    expandObj[id] = true
                } else {

                    expandObj[id] = false
                }
            }

            setExpandItem(expandObj)
        }
    }


    const [{ isOver }, drop] = useDrop({
        accept: ItemTypes.ITEM,
        drop: (item) => {
            handleDrop(item);
        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    })

    let graphData = selectedPlan.graphData

    graphData = graphData.map(datapoint => {
        return { x: datapoint.x, y: parseFloat(datapoint.y.toFixed(2)) }
    })

    return (
        <div className='graph-container'>
            <div className='chart-drop-area' ref={drop}>
                {selectedPlan && <XYPlot
                    // dontCheckIfEmpty

                    margin={{ left: 60 }}
                    height={700}
                    width={1000}
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
                            userSelect: 'none',
                            text: {
                                fill: 'white'
                            }
                        }}
                        tickLabelAngle={15}
                        tickPadding={20}
                    />
                    <YAxis
                        animation
                        style={{
                            userSelect: 'none',
                            text: {
                                fill: 'white'
                            }
                        }}
                    />
                    <LineSeries
                        data={graphData}
                        onNearestX={handleNearestX}
                        color='rgb(110, 211, 43)'
                    />
                    <Highlight
                        // onBrush={() => {
                        //     // console.log('on brush')
                        //     // if (brushCounter < 1) {
                        //     //     setBrushCounter(brushCounter + 1)
                        //     // } else {
                        //     //     console.log('disable layer')
                        //     //     setDisableLayer(true)
                        //     // }


                        // }}
                        onBrushEnd={area => {
                            // setBrushCounter(0)
                            if (area) {
                                setDisableLayer(true)
                                setLastDrawLocation(area)
                            }
                        }}
                    />
                    {crosshair.length !== 0 && <Crosshair
                        values={crosshair}
                    >
                        <div className='crosshair'>
                            <Typography>{crosshair[0].x.toString().slice(0, 15)}</Typography>
                            <Typography>${crosshair[0].y.toFixed(2)}</Typography>
                        </div>
                    </Crosshair>}
                </XYPlot>}
            </div>
            <Layer />
            <Backdrop className={classes.backdrop} open={backdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}

export default LineChart