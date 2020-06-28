import React, { useState, useContext, useEffect } from 'react'
import Checkbox from '@material-ui/core/Checkbox';
import apiBaseUrl from './config';
import Context from './Context';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import EditIcon from '@material-ui/icons/Edit';
import { KeyboardDatePicker } from "@material-ui/pickers";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { ItemTypes } from './ItemTypes';
import { useDrag, useDrop } from 'react-dnd';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    tableBody: {
        width: '100%'
    },
    tableRow: {
        width: '100%'
    }
}));


const ToggleExpense = ({ id, amount, description, displayed, date, repeatingInterval }) => {
    const classes = useStyles();

    const dateObj = new Date(date[0], date[1], date[2])

    const { selectedPlan, setSelectedPlan, expandItem, setExpandItem } = useContext(Context)

    console.log(expandItem)

    const [checked, setChecked] = useState(displayed)
    const [backdrop, setBackdrop] = useState(false)
    const [edit, setEdit] = useState({
        amount: false,
        date: false,
        repeatingInterval: false,
    })

    const [currentAmount, setCurrentAmount] = useState(amount)
    const [amountInput, setAmountInput] = useState(amount.toString())
    const [currentDate, setCurrentDate] = useState(date)
    const [dateInput, setDateInput] = useState(dateObj)


    const handleToggle = async () => {
        setBackdrop(true)
        const res = await fetch(`${apiBaseUrl}/plans/${selectedPlan._id}/expenses/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                displayed: !checked
            }),
            headers: {
                "Content-Type": 'application/json',
            }
        })
        if (res.ok) {
            const plan = await res.json()
            const dateObjData = plan.graphData.map(datapoint => {
                return { x: new Date(datapoint.x), y: datapoint.y }
            })

            plan.graphData = dateObjData
            setSelectedPlan(plan)

            if (checked) {
                setEdit({
                    amount: false,
                    date: false,
                    repeatingInterval: false,
                })
            }

            setChecked(!checked)

            setBackdrop(false)
        }

    }

    const amountChange = (e) => {
        setAmountInput(e.target.value)

        if (e.target.value !== '') {
            const previousAmount = currentAmount
            const amountFloat = parseFloat(e.target.value)
            setCurrentAmount(amountFloat)


            const dateMilliseconds = new Date(date[0], date[1], date[2]).getTime()

            const planCopy = { ...selectedPlan }
            const graphDataArr = planCopy.graphData

            let firstDayIndex;

            graphDataArr.forEach((datapoint, i) => {
                if (datapoint.x.getTime() === dateMilliseconds) {
                    firstDayIndex = i
                }
            })

            const amountDifference = amountFloat - previousAmount


            // Will have to change repeatingInterval variable if interval can be edited

            if (!repeatingInterval) {
                for (let i = firstDayIndex; i < graphDataArr.length; i++) {
                    graphDataArr[i].y -= amountDifference
                }
            } else if (repeatingInterval === 'Daily') {
                let daysPassed = 0
                for (let i = firstDayIndex; i < graphDataArr.length; i++) {
                    daysPassed++
                    graphDataArr[i].y -= (amountDifference * daysPassed)
                }
            } else if (repeatingInterval === 'Weekly') {
                let weeksPassed = 0
                for (let i = firstDayIndex; i < graphDataArr.length; i++) {
                    if ((i - firstDayIndex) % 7 === 0) {
                        weeksPassed++
                    }
                    graphDataArr[i].y -= (amountDifference * weeksPassed)
                }
            } else if (repeatingInterval === 'Monthly') {

                // Need to subtract expense every day, only increase the amount subtracted every month

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

                    if (graphDataArr[i].x.getMonth() === currentMonth
                        && graphDataArr[i].x.getDate() === day) {
                        monthsPassed++
                        foundDayInMonth = true;
                    }

                    if (graphDataArr[i + 1]
                        && graphDataArr[i].x.getMonth() !== graphDataArr[i + 1].x.getMonth()
                        && !foundDayInMonth) {
                        monthsPassed++
                    }

                    graphDataArr[i].y -= (amountDifference * monthsPassed)

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

                    graphDataArr[i].y -= (amountDifference * yearsPassed)

                }
            }

            setSelectedPlan(planCopy)

        }


    }


    const dateChange = date => {
        setDateInput(date)
        if (date.c) {

            const dateObj = new Date(currentDate[0], currentDate[1], currentDate[2])
            const dateMilliseconds = new Date(currentDate[0], currentDate[1], currentDate[2]).getTime()

            setCurrentDate([date.c.year, date.c.month - 1, date.c.day])

            const newDateMilliseconds = new Date(date.c.year, date.c.month - 1, date.c.day).getTime()

            const planCopy = { ...selectedPlan }
            const graphDataArr = planCopy.graphData


            let firstDayIndex;

            graphDataArr.forEach((datapoint, i) => {
                if (datapoint.x.getTime() === dateMilliseconds) {
                    firstDayIndex = i
                }
            })

            if (!repeatingInterval) {
                for (let i = firstDayIndex; i < graphDataArr.length; i++) {
                    graphDataArr[i].y += currentAmount
                }
            } else if (repeatingInterval === 'Daily') {
                let daysPassed = 0
                for (let i = firstDayIndex; i < graphDataArr.length; i++) {
                    daysPassed++
                    graphDataArr[i].y += (currentAmount * daysPassed)
                }
            } else if (repeatingInterval === 'Weekly') {
                let weeksPassed = 0
                for (let i = firstDayIndex; i < graphDataArr.length; i++) {
                    if ((i - firstDayIndex) % 7 === 0) {
                        weeksPassed++
                    }
                    graphDataArr[i].y += (currentAmount * weeksPassed)
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

                    graphDataArr[i].y += (currentAmount * monthsPassed)

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

                    graphDataArr[i].y += (currentAmount * yearsPassed)

                }
            }

            const newDateObj = new Date(date.c.year, date.c.month - 1, date.c.day)

            let newFirstDayIndex;

            graphDataArr.forEach((datapoint, i) => {
                if (datapoint.x.getTime() === newDateMilliseconds) {
                    newFirstDayIndex = i
                }
            })

            if (!repeatingInterval) {
                for (let i = newFirstDayIndex; i < graphDataArr.length; i++) {
                    graphDataArr[i].y -= currentAmount
                }
            } else if (repeatingInterval === 'Daily') {
                let daysPassed = 0
                for (let i = newFirstDayIndex; i < graphDataArr.length; i++) {
                    daysPassed++
                    graphDataArr[i].y -= (currentAmount * daysPassed)
                }
            } else if (repeatingInterval === 'Weekly') {
                let weeksPassed = 0
                for (let i = newFirstDayIndex; i < graphDataArr.length; i++) {
                    if ((i - newFirstDayIndex) % 7 === 0) {
                        weeksPassed++
                    }
                    graphDataArr[i].y -= (currentAmount * weeksPassed)
                }
            } else if (repeatingInterval === 'Monthly') {

                const day = newDateObj.getDate()
                // console.log(day)
                let monthsPassed = 0
                let currentMonth = newDateObj.getMonth()
                // console.log(currentMonth)
                let foundDayInMonth = false

                for (let i = newFirstDayIndex; i < graphDataArr.length; i++) {

                    if (graphDataArr[i].x.getMonth() !== currentMonth) {
                        // Update month

                        currentMonth = graphDataArr[i].x.getMonth()
                        foundDayInMonth = false
                    }

                    if (graphDataArr[i].x.getMonth() === currentMonth && graphDataArr[i].x.getDate() === day) {

                        monthsPassed++
                        foundDayInMonth = true;
                        // graphDataArr[i].y -= (currentAmount * monthsPassed)
                    }

                    if (graphDataArr[i + 1] && graphDataArr[i].x.getMonth() !== graphDataArr[i + 1].x.getMonth() && !foundDayInMonth) {
                        monthsPassed++

                    }

                    graphDataArr[i].y -= (currentAmount * monthsPassed)

                }

            } else if (repeatingInterval === 'Yearly') {


                const day = newDateObj.getDate()
                const month = newDateObj.getMonth()
                let yearsPassed = 0
                for (let i = newFirstDayIndex; i < graphDataArr.length; i++) {

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
            setSelectedPlan(planCopy)
        }


    }

    const editClick = (row) => {
        setEdit({ ...edit, [row]: true })

    }

    const handleSaveAmount = async () => {
        setBackdrop(true)
        const res = await fetch(`${apiBaseUrl}/plans/${selectedPlan._id}/expenses/${id}/amount`, {
            method: 'PATCH',
            body: JSON.stringify({
                amount: currentAmount,
                graphData: selectedPlan.graphData
            }),
            headers: {
                "Content-Type": 'application/json',
            }
        })
        if (res.ok) {
            // const plan = await res.json()
            // const dateObjData = plan.graphData.map(datapoint => {
            //     return { x: new Date(datapoint.x), y: datapoint.y }
            // })

            // plan.graphData = dateObjData
            // setSelectedPlan(plan)

            setEdit({
                ...edit,
                amount: false
            })
            setBackdrop(false)
        }
    }

    const handleSaveDate = async () => {
        setBackdrop(true)
        const res = await fetch(`${apiBaseUrl}/plans/${selectedPlan._id}/expenses/${id}/date`, {
            method: 'PATCH',
            body: JSON.stringify({
                date: currentDate,
                graphData: selectedPlan.graphData
            }),
            headers: {
                "Content-Type": 'application/json',
            }
        })
        if (res.ok) {
            // const plan = await res.json()
            // const dateObjData = plan.graphData.map(datapoint => {
            //     return { x: new Date(datapoint.x), y: datapoint.y }
            // })

            // plan.graphData = dateObjData
            // setSelectedPlan(plan)

            setEdit({
                ...edit,
                date: false
            })
            setBackdrop(false)
        }

    }

    const currentDateDisplay = new Date(currentDate[0], currentDate[1], currentDate[2]).toString().slice(3, 15)

    const [{ isDragging }, drag] = useDrag({
        item: {
            type: ItemTypes.ITEM,
            currentAmount,
            currentDate,
            repeatingInterval,
            expense: true
        },
        begin: () => {

        },
        end: (item) => {

        },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    })

    const clickExpansionPanel = () => {
        setExpandItem({ ...expandItem, [id]: !expandItem[id] })
    }




    const labelId = `checkbox-list-secondary-label-${description}`;

    return (

        <div className='side-list-container'>
            <div className='checkbox-container'>
                <Checkbox
                    edge="end"
                    onChange={handleToggle}
                    checked={checked}
                    inputProps={{ 'aria-labelledby': labelId }}
                    style={{ marginRight: 10, color: 'rgb(238, 122, 122)' }}
                />
            </div>
            <div className={classes.root} ref={drag}>
                <ExpansionPanel
                    expanded={expandItem[id]}

                    onClick={clickExpansionPanel}
                >
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography className={classes.heading}>{description}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <TableBody className={classes.tableBody}>
                            <TableRow key={amount} className={classes.tableRow}>
                                <TableCell component="th" scope="row">
                                    Amount
                        </TableCell>
                                {!edit.amount
                                    ? <>
                                        <TableCell align='right'>
                                        </TableCell>
                                        <TableCell align='right'>
                                        </TableCell>
                                        <TableCell align="right">
                                            ${currentAmount}
                                        </TableCell>
                                        <TableCell align="right">
                                            {checked &&
                                                <div className='edit-icon'>
                                                    <EditIcon onClick={() => editClick('amount')} />
                                                </div>
                                            }

                                        </TableCell>
                                    </>
                                    :
                                    <>
                                        <TableCell align="right" colSpan={4}>
                                            <TextField
                                                type='number'
                                                id="edit-amount"
                                                value={amountInput}
                                                onChange={amountChange}
                                                InputProps={{
                                                    endAdornment: <InputAdornment>
                                                        <IconButton onClick={handleSaveAmount}>
                                                            <CheckCircleIcon />
                                                        </IconButton>
                                                    </InputAdornment>
                                                }}
                                            />
                                        </TableCell>
                                        {/* <TableCell align="right">
                                            <Button onClick={handleSaveAmount}>Save</Button>
                                        </TableCell> */}
                                    </>}
                            </TableRow>
                            <TableRow key={currentDateDisplay}>
                                <TableCell component="th" scope="row">
                                    Date
                        </TableCell>
                                {!edit.date
                                    ? <>
                                        <TableCell align='right'>
                                        </TableCell>
                                        <TableCell align='right'>
                                        </TableCell>
                                        <TableCell align="right">
                                            {currentDateDisplay}
                                        </TableCell>

                                        <TableCell align="right">
                                            {checked &&
                                                <div className='edit-icon'>
                                                    <EditIcon onClick={() => editClick('date')} />
                                                </div>}
                                        </TableCell>
                                    </>
                                    :
                                    <>
                                        <TableCell align="right" colSpan={4}>
                                            <KeyboardDatePicker
                                                autoOk
                                                variant="inline"
                                                inputVariant="outlined"
                                                format="MM/dd/yyyy"
                                                value={dateInput}
                                                InputAdornmentProps={{ position: "start" }}
                                                // endAdornment={{}}
                                                InputProps={{
                                                    endAdornment: <InputAdornment>
                                                        <IconButton onClick={handleSaveDate}>
                                                            <CheckCircleIcon />
                                                        </IconButton>
                                                    </InputAdornment>
                                                }}
                                                onChange={date => dateChange(date)}
                                            />
                                        </TableCell>
                                        {/* <TableCell align="right">
                                            <Button onClick={handleSaveDate}>Save</Button>
                                        </TableCell> */}
                                    </>}
                            </TableRow>
                            <TableRow key={repeatingInterval}>
                                <TableCell component="th" scope="row">
                                    Repeats?
                        </TableCell>
                                <>
                                    <TableCell align='right'>
                                    </TableCell>
                                    <TableCell align='right'>
                                    </TableCell>
                                    <TableCell align="right">{repeatingInterval ? repeatingInterval : 'No'}</TableCell>
                                    <TableCell align="right">
                                    </TableCell>
                                </>
                            </TableRow>
                        </TableBody>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
            <Backdrop className={classes.backdrop} open={backdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div >
    )
}

export default ToggleExpense