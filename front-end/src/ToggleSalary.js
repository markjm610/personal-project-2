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
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
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
}));


const ToggleSalary = ({ id, name, displayed, amountPerYear, afterTaxAmount, taxRate, startDate, endDate }) => {
    const classes = useStyles();



    const { selectedPlan, setSelectedPlan } = useContext(Context)
    const [checked, setChecked] = useState(displayed)
    const [backdrop, setBackdrop] = useState(false)
    const [edit, setEdit] = useState({
        amountPerYear: false,
        taxRate: false,
        startDate: false,
        endDate: false
    })

    // const startDateStringArr = startDate.map((num, i) => {
    //     if (i === 1 || i === 2) {
    //         return num.toString().padStart(2, '0')
    //     } else {
    //         return num.toString()
    //     }
    // })

    // const startDateString = startDateStringArr.join('-')

    const startDateObj = new Date(startDate[0], startDate[1], startDate[2])
    const endDateObj = new Date(endDate[0], endDate[1], endDate[2])
    // const endDateStringArr = endDate.map((num, i) => {
    //     if (i === 1 || i === 2) {
    //         return num.toString().padStart(2, '0')
    //     } else {
    //         return num.toString()
    //     }
    // })

    // const endDateString = endDateStringArr.join('-')

    const [currentAmountPerYear, setCurrentAmountPerYear] = useState(amountPerYear)
    const [amountPerYearInput, setAmountPerYearInput] = useState(amountPerYear.toString())
    const [currentTaxRate, setCurrentTaxRate] = useState(taxRate)
    const [taxRateInput, setTaxRateInput] = useState((taxRate * 100).toString())
    const [currentAfterTaxAmount, setCurrentAfterTaxAmount] = useState(afterTaxAmount)
    const [currentStartDateArr, setCurrentStartDateArr] = useState(startDate)
    const [currentEndDateArr, setCurrentEndDateArr] = useState(endDate)
    const [startDateInput, setStartDateInput] = useState(startDateObj)
    const [endDateInput, setEndDateInput] = useState(endDateObj)


    const startDateDisplay = new Date(startDate[0], startDate[1], startDate[2]).toString().slice(3, 15)
    const endDateDisplay = new Date(endDate[0], endDate[1], endDate[2]).toString().slice(3, 15)

    const handleToggle = async () => {
        setBackdrop(true)
        const res = await fetch(`${apiBaseUrl}/plans/${selectedPlan._id}/salaries/${id}`, {
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

    const editClick = (row) => {

        if (edit.amountPerYear || edit.taxRate) {
            handleSaveAmount()
        } else if (edit.startDate || edit.endDate) {
            handleSaveDate()
        }


        if (row === 'amountPerYear') {
            setEdit({
                amountPerYear: true,
                taxRate: false,
                startDate: false,
                endDate: false
            })
        } else if (row === 'taxRate') {
            setEdit({
                amountPerYear: false,
                taxRate: true,
                startDate: false,
                endDate: false
            })
        } else if (row === 'startDate') {
            setEdit({
                amountPerYear: false,
                taxRate: false,
                startDate: true,
                endDate: false
            })
        } else if (row === 'endDate') {
            setEdit({
                amountPerYear: false,
                taxRate: false,
                startDate: false,
                endDate: true
            })
        }

    }

    const amountPerYearChange = (e) => {
        setAmountPerYearInput(e.target.value)

        if (e.target.value !== '') {
            const previousAfterTaxAmount = currentAfterTaxAmount

            const amountPerYearFloat = parseFloat(e.target.value)

            setCurrentAmountPerYear(amountPerYearFloat)


            const newAfterTaxAmount = amountPerYearFloat - amountPerYearFloat * currentTaxRate

            setCurrentAfterTaxAmount(newAfterTaxAmount)

            const planCopy = { ...selectedPlan }
            const graphDataArr = planCopy.graphData

            const afterTaxAmountDifference = newAfterTaxAmount - previousAfterTaxAmount

            const startMilliseconds = new Date(currentStartDateArr[0], currentStartDateArr[1], currentStartDateArr[2]).getTime()
            const endMilliseconds = new Date(currentEndDateArr[0], currentEndDateArr[1], currentEndDateArr[2]).getTime()

            let firstDayIndex;

            graphDataArr.forEach((datapoint, i) => {
                if (datapoint.x.getTime() === startMilliseconds) {
                    firstDayIndex = i
                }
            })

            const dayDifference = (endMilliseconds - startMilliseconds) / (1000 * 60 * 60 * 24)

            let daysPassed = 0

            for (let i = firstDayIndex; i < graphDataArr.length; i++) {

                if (i < firstDayIndex + dayDifference) {
                    // For every day in salary period, add that day's proportion of salary to total
                    daysPassed++

                    const amountToAdd = afterTaxAmountDifference / 365 * daysPassed

                    graphDataArr[i].y += amountToAdd
                } else {
                    // Once salary period is over, add full amount every day to total
                    graphDataArr[i].y += afterTaxAmountDifference / 365 * daysPassed
                }


            }
            setSelectedPlan(planCopy)
        }

    }

    const taxRateChange = (e) => {
        setTaxRateInput(e.target.value)
        if (e.target.value !== '') {

            const taxRateToDecimal = parseFloat(e.target.value) / 100
            setCurrentTaxRate(taxRateToDecimal)

            const newAfterTaxAmount = currentAmountPerYear - currentAmountPerYear * taxRateToDecimal

            const previousAfterTaxAmount = currentAfterTaxAmount

            setCurrentAfterTaxAmount(newAfterTaxAmount)

            const planCopy = { ...selectedPlan }
            const graphDataArr = planCopy.graphData

            const afterTaxAmountDifference = newAfterTaxAmount - previousAfterTaxAmount

            const startMilliseconds = new Date(currentStartDateArr[0], currentStartDateArr[1], currentStartDateArr[2]).getTime()
            const endMilliseconds = new Date(currentEndDateArr[0], currentEndDateArr[1], currentEndDateArr[2]).getTime()

            let firstDayIndex;

            graphDataArr.forEach((datapoint, i) => {
                if (datapoint.x.getTime() === startMilliseconds) {
                    firstDayIndex = i
                }
            })

            const dayDifference = (endMilliseconds - startMilliseconds) / (1000 * 60 * 60 * 24)

            let daysPassed = 0

            for (let i = firstDayIndex; i < graphDataArr.length; i++) {

                if (i < firstDayIndex + dayDifference) {
                    // For every day in salary period, add that day's proportion of salary to total
                    daysPassed++

                    const amountToAdd = afterTaxAmountDifference / 365 * daysPassed

                    graphDataArr[i].y += amountToAdd
                } else {
                    // Once salary period is over, add full amount every day to total
                    graphDataArr[i].y += afterTaxAmountDifference / 365 * daysPassed
                }


            }
            setSelectedPlan(planCopy)
        }


    }

    const startDateChange = date => {
        setStartDateInput(date)

        if (date.c) {

            const previousStartMilliseconds = new Date(currentStartDateArr[0], currentStartDateArr[1], currentStartDateArr[2]).getTime()
            const endMilliseconds = new Date(currentEndDateArr[0], currentEndDateArr[1], currentEndDateArr[2]).getTime()

            setCurrentStartDateArr([date.c.year, date.c.month - 1, date.c.day])



            const planCopy = { ...selectedPlan }
            const graphDataArr = planCopy.graphData


            let firstDayIndex;

            graphDataArr.forEach((datapoint, i) => {
                if (datapoint.x.getTime() === previousStartMilliseconds) {
                    firstDayIndex = i
                }
            })

            const dayDifference = (endMilliseconds - previousStartMilliseconds) / (1000 * 60 * 60 * 24)

            let daysPassed = 0

            for (let i = firstDayIndex; i < graphDataArr.length; i++) {

                if (i < firstDayIndex + dayDifference) {

                    daysPassed++

                    const amountToAdd = currentAfterTaxAmount / 365 * daysPassed

                    graphDataArr[i].y -= amountToAdd


                } else {

                    graphDataArr[i].y -= currentAfterTaxAmount / 365 * daysPassed

                }


            }


            const newStartMilliseconds = new Date(date.c.year, date.c.month - 1, date.c.day).getTime()

            const newDayDifference = (endMilliseconds - newStartMilliseconds) / (1000 * 60 * 60 * 24)

            let newFirstDayIndex;

            graphDataArr.forEach((datapoint, i) => {
                if (datapoint.x.getTime() === newStartMilliseconds) {
                    newFirstDayIndex = i
                }
            })

            let newDaysPassed = 0


            for (let i = newFirstDayIndex; i < graphDataArr.length; i++) {

                if (i < newFirstDayIndex + newDayDifference) {

                    newDaysPassed++

                    const amountToAdd = currentAfterTaxAmount / 365 * newDaysPassed

                    graphDataArr[i].y += amountToAdd
                } else {

                    graphDataArr[i].y += currentAfterTaxAmount / 365 * newDaysPassed
                }
            }

            setSelectedPlan(planCopy)
        }


    }

    const endDateChange = date => {
        setEndDateInput(date)


        if (date.c) {

            const startMilliseconds = new Date(currentStartDateArr[0], currentStartDateArr[1], currentStartDateArr[2]).getTime()
            const previousEndMilliseconds = new Date(currentEndDateArr[0], currentEndDateArr[1], currentEndDateArr[2]).getTime()

            setCurrentEndDateArr([date.c.year, date.c.month - 1, date.c.day])


            const planCopy = { ...selectedPlan }
            const graphDataArr = planCopy.graphData
            // graphDataArr and planCopy.graphData must be pointing to the same array because otherwise
            // this makes no sense

            let firstDayIndex;

            graphDataArr.forEach((datapoint, i) => {
                if (datapoint.x.getTime() === startMilliseconds) {
                    firstDayIndex = i
                }
            })

            const dayDifference = (previousEndMilliseconds - startMilliseconds) / (1000 * 60 * 60 * 24)

            let daysPassed = 0

            for (let i = firstDayIndex; i < graphDataArr.length; i++) {

                if (i < firstDayIndex + dayDifference) {

                    daysPassed++

                    const amountToAdd = currentAfterTaxAmount / 365 * daysPassed

                    graphDataArr[i].y -= amountToAdd


                } else {

                    graphDataArr[i].y -= currentAfterTaxAmount / 365 * daysPassed

                }


            }


            const newEndMilliseconds = new Date(date.c.year, date.c.month - 1, date.c.day).getTime()

            const newDayDifference = (newEndMilliseconds - startMilliseconds) / (1000 * 60 * 60 * 24)

            let newFirstDayIndex;

            graphDataArr.forEach((datapoint, i) => {
                if (datapoint.x.getTime() === startMilliseconds) {
                    newFirstDayIndex = i
                }
            })

            let newDaysPassed = 0


            for (let i = newFirstDayIndex; i < graphDataArr.length; i++) {

                if (i < newFirstDayIndex + newDayDifference) {

                    newDaysPassed++

                    const amountToAdd = currentAfterTaxAmount / 365 * newDaysPassed

                    graphDataArr[i].y += amountToAdd
                } else {

                    graphDataArr[i].y += currentAfterTaxAmount / 365 * newDaysPassed
                }
            }

            setSelectedPlan(planCopy)
        }
    }

    const handleSaveAmount = async () => {
        setBackdrop(true)
        const res = await fetch(`${apiBaseUrl}/plans/${selectedPlan._id}/salaries/${id}/amount`, {
            method: 'PATCH',
            body: JSON.stringify({
                amountPerYear: currentAmountPerYear,
                taxRate: currentTaxRate,
                afterTaxAmount: currentAfterTaxAmount,
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
                amountPerYear: false,
                taxRate: false,
            })
            setBackdrop(false)
        }

    }

    const handleSaveDate = async () => {
        setBackdrop(true)
        const res = await fetch(`${apiBaseUrl}/plans/${selectedPlan._id}/salaries/${id}/date`, {
            method: 'PATCH',
            body: JSON.stringify({
                startDate: currentStartDateArr,
                endDate: currentEndDateArr,
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
                startDate: false,
                endDate: false,
            })
            setBackdrop(false)
        }

    }

    // const [currentAmountPerYear, setCurrentAmountPerYear] = useState(amountPerYear)
    // const [amountPerYearInput, setAmountPerYearInput] = useState(amountPerYear.toString())
    // const [currentTaxRate, setCurrentTaxRate] = useState(taxRate)
    // const [taxRateInput, setTaxRateInput] = useState((taxRate * 100).toString())
    // const [currentAfterTaxAmount, setCurrentAfterTaxAmount] = useState(afterTaxAmount)
    // const [currentStartDateArr, setCurrentStartDateArr] = useState(startDate)
    // const [currentEndDateArr, setCurrentEndDateArr] = useState(endDate)
    // const [startDateInput, setStartDateInput] = useState(startDateObj)
    // const [endDateInput, setEndDateInput] = useState(endDateObj)


    const [{ isDragging }, drag] = useDrag({
        item: {
            type: ItemTypes.SALARY,
            currentAfterTaxAmount,
            currentStartDateArr,
            currentEndDateArr
        },
        begin: () => {

        },
        end: (item) => {

        },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    })






    const labelId = `checkbox-list-secondary-label-${name}`;

    return (
        <>
            <div className='side-list-container'>
                <div className='checkbox-container'>
                    <Checkbox
                        edge="end"
                        onChange={handleToggle}
                        checked={checked}
                        inputProps={{ 'aria-labelledby': labelId }}
                        style={{ marginRight: 10, color: 'rgb(110, 211, 43)' }}
                    />
                </div>
                <div className={classes.root} ref={drag}>
                    <ExpansionPanel>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography className={classes.heading}>{name}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <TableBody>
                                <TableRow key={amountPerYear}>
                                    <TableCell component="th" scope="row">
                                        Amount Per Year
                                            </TableCell>
                                    {!edit.amountPerYear
                                        ? <>
                                            <TableCell align='right'>
                                            </TableCell>
                                            <TableCell align='right'>
                                            </TableCell>
                                            <TableCell align="right">${amountPerYear}</TableCell>
                                            <TableCell align="right">
                                                {checked && <div className='edit-icon'>
                                                    <EditIcon onClick={() => editClick('amountPerYear')} />
                                                </div>}

                                            </TableCell>
                                        </>
                                        :
                                        <>
                                            <TableCell align="right" colSpan={4}>
                                                <TextField
                                                    type='number'
                                                    id="edit-amountPerYear"
                                                    value={amountPerYearInput}
                                                    onChange={amountPerYearChange}
                                                    InputProps={{
                                                        endAdornment: <InputAdornment>
                                                            <IconButton onClick={handleSaveAmount}>
                                                                <CheckCircleIcon />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }}
                                                />
                                            </TableCell>

                                        </>}
                                </TableRow>
                                <TableRow key={taxRate}>
                                    <TableCell component="th" scope="row">
                                        Tax Rate
                        </TableCell>{!edit.taxRate
                                        ? <>
                                            <TableCell align='right'>
                                            </TableCell>
                                            <TableCell align='right'>
                                            </TableCell>
                                            <TableCell align="right">{taxRate * 100}%</TableCell>
                                            <TableCell align="right">
                                                {checked && <div className='edit-icon'>
                                                    <EditIcon onClick={() => editClick('taxRate')} />
                                                </div>}

                                            </TableCell>
                                        </>
                                        :
                                        <>
                                            <TableCell align="right" colSpan={4}>
                                                <TextField
                                                    type='number'
                                                    id="edit-taxRate"
                                                    value={taxRateInput}
                                                    onChange={taxRateChange}
                                                    InputProps={{
                                                        endAdornment: <InputAdornment>
                                                            <IconButton onClick={handleSaveAmount}>
                                                                <CheckCircleIcon />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }}
                                                />
                                            </TableCell>

                                        </>}
                                </TableRow>
                                <TableRow key={afterTaxAmount}>
                                    <TableCell component="th" scope="row">
                                        Amount After Tax
                        </TableCell>
                                    <TableCell align='right'>
                                    </TableCell>
                                    <TableCell align='right'>
                                    </TableCell>
                                    <TableCell align="right">${currentAfterTaxAmount}</TableCell>
                                    <TableCell align="right"></TableCell>

                                </TableRow>
                                <TableRow key={startDateDisplay}>
                                    <TableCell component="th" scope="row">
                                        Start Date
                        </TableCell>
                                    {!edit.startDate
                                        ? <>
                                            <TableCell align='right'>
                                            </TableCell>
                                            <TableCell align='right'>
                                            </TableCell>
                                            <TableCell align="right">{startDateDisplay}</TableCell>
                                            <TableCell align="right">
                                                {checked && <div className='edit-icon'>
                                                    <EditIcon onClick={() => editClick('startDate')} />
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
                                                    value={startDateInput}
                                                    InputAdornmentProps={{ position: "start" }}
                                                    InputProps={{
                                                        endAdornment: <InputAdornment>
                                                            <IconButton onClick={handleSaveDate}>
                                                                <CheckCircleIcon />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }}
                                                    onChange={date => startDateChange(date)}
                                                />
                                            </TableCell>
                                        </>}
                                </TableRow>
                                <TableRow key={endDateDisplay}>
                                    <TableCell component="th" scope="row">
                                        End Date
                        </TableCell>
                                    {!edit.endDate
                                        ? <>
                                            <TableCell align='right'>
                                            </TableCell>
                                            <TableCell align='right'>
                                            </TableCell>
                                            <TableCell align="right">{endDateDisplay}</TableCell>
                                            <TableCell align="right">
                                                {checked && <div className='edit-icon'>
                                                    <EditIcon onClick={() => editClick('endDate')} />
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
                                                    value={endDateInput}
                                                    InputAdornmentProps={{ position: "start" }}
                                                    InputProps={{
                                                        endAdornment: <InputAdornment>
                                                            <IconButton onClick={handleSaveDate}>
                                                                <CheckCircleIcon />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }}
                                                    onChange={date => endDateChange(date)}
                                                />
                                            </TableCell>
                                        </>}
                                </TableRow>
                            </TableBody>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </div>
            </div>
            <Backdrop className={classes.backdrop} open={backdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    )
}

export default ToggleSalary