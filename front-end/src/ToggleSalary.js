import React, { useState, useContext, useEffect } from 'react'
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
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
import Button from '@material-ui/core/Button';


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
    const [infoDisplay, setInfoDisplay] = useState(false)
    const [backdrop, setBackdrop] = useState(false)
    const [edit, setEdit] = useState({
        amountPerYear: false,
        taxRate: false,
        startDate: false,
        endDate: false
    })

    const startDateStringArr = startDate.map((num, i) => {
        if (i === 1 || i === 2) {
            return num.toString().padStart(2, '0')
        } else {
            return num.toString()
        }
    })

    const startDateString = startDateStringArr.join('-')

    const endDateStringArr = endDate.map((num, i) => {
        if (i === 1 || i === 2) {
            return num.toString().padStart(2, '0')
        } else {
            return num.toString()
        }
    })

    const endDateString = endDateStringArr.join('-')

    const [currentAmountPerYear, setCurrentAmountPerYear] = useState(amountPerYear)
    const [amountPerYearInput, setAmountPerYearInput] = useState(amountPerYear.toString())
    const [currentTaxRate, setCurrentTaxRate] = useState(taxRate)
    const [taxRateInput, setTaxRateInput] = useState((taxRate * 100).toString())
    const [currentAfterTaxAmount, setCurrentAfterTaxAmount] = useState(afterTaxAmount)
    const [currentStartDateArr, setCurrentStartDateArr] = useState(startDate)
    const [currentEndDateArr, setCurrentEndDateArr] = useState(endDate)
    const [startDateInput, setStartDateInput] = useState(startDateString)
    const [endDateInput, setEndDateInput] = useState(endDateString)


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

            setChecked(!checked)
            setBackdrop(false)
        }

    }

    const toggleInfo = () => {
        setInfoDisplay(!infoDisplay)
    }

    const editClick = (row) => {
        setEdit({ ...edit, [row]: true })

    }

    const amountPerYearChange = (e) => {

        const amountPerYearFloat = parseFloat(e.target.value)
        setCurrentAmountPerYear(amountPerYearFloat)
        setAmountPerYearInput(e.target.value)
        setCurrentAfterTaxAmount(amountPerYearFloat - amountPerYearFloat * taxRate)

    }

    const taxRateChange = (e) => {
        setTaxRateInput(e.target.value)
        const taxRateToDecimal = parseFloat(e.target.value) / 100
        setCurrentTaxRate(taxRateToDecimal)
        setCurrentAfterTaxAmount(currentAmountPerYear - currentAmountPerYear * taxRateToDecimal)
    }

    const startDateChange = e => {
        setStartDateInput(e.target.value)
        const stringDateArr = e.target.value.split('-')
        const numDateArr = stringDateArr.map((number, i) => {
            if (i === 1) {
                return parseInt(number) - 1
            }
            return parseInt(number)
        })

        setCurrentStartDateArr(numDateArr)
    }

    const endDateChange = (e) => {
        setEndDateInput(e.target.value)
        const stringDateArr = e.target.value.split('-')
        const numDateArr = stringDateArr.map((number, i) => {
            if (i === 1) {
                return parseInt(number) - 1
            }
            return parseInt(number)
        })

        setCurrentEndDateArr(numDateArr)
    }

    const handleSaveAmount = async () => {
        setBackdrop(true)
        const res = await fetch(`${apiBaseUrl}/plans/${selectedPlan._id}/salaries/${id}/amount`, {
            method: 'PATCH',
            body: JSON.stringify({
                amountPerYear: currentAmountPerYear,
                taxRate: currentTaxRate,
                afterTaxAmount: currentAfterTaxAmount
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
                endDate: currentEndDateArr
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

            setEdit({
                ...edit,
                startDate: false,
                endDate: false,
            })
            setBackdrop(false)
        }

    }



    const labelId = `checkbox-list-secondary-label-${name}`;

    return (
        <>
            <div className='side-list-container'>
                <Checkbox
                    edge="end"
                    onChange={handleToggle}
                    checked={checked}
                    inputProps={{ 'aria-labelledby': labelId }}
                    style={{ marginRight: 10, color: 'rgb(110, 211, 43)' }}
                />
                <div className={classes.root}>
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
                                            <TableCell align="right">${amountPerYear}</TableCell>
                                            <TableCell align="right">
                                                <div className='edit-icon'>
                                                    <EditIcon onClick={() => editClick('amountPerYear')} />
                                                </div>
                                            </TableCell>
                                        </>
                                        :
                                        <>
                                            <TableCell align="right">
                                                <TextField type='number' id="edit-amountPerYear" value={amountPerYearInput} onChange={amountPerYearChange} />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button onClick={handleSaveAmount}>Save</Button>
                                            </TableCell>
                                        </>}
                                </TableRow>
                                <TableRow key={taxRate}>
                                    <TableCell component="th" scope="row">
                                        Tax Rate
                        </TableCell>{!edit.taxRate
                                        ? <>
                                            <TableCell align="right">{taxRate * 100}%</TableCell>
                                            <TableCell align="right">
                                                <div className='edit-icon'>
                                                    <EditIcon onClick={() => editClick('taxRate')} />
                                                </div>
                                            </TableCell>
                                        </>
                                        :
                                        <>
                                            <TableCell align="right">
                                                <TextField type='number' id="edit-taxRate" value={taxRateInput} onChange={taxRateChange} />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button onClick={handleSaveAmount}>Save</Button>
                                            </TableCell>
                                        </>}
                                </TableRow>
                                <TableRow key={afterTaxAmount}>
                                    <TableCell component="th" scope="row">
                                        Amount After Tax
                        </TableCell>

                                    <TableCell align="right">${currentAfterTaxAmount}</TableCell>
                                    <TableCell align="right"></TableCell>

                                </TableRow>
                                <TableRow key={startDateDisplay}>
                                    <TableCell component="th" scope="row">
                                        Start Date
                        </TableCell>{!edit.startDate
                                        ? <>
                                            <TableCell align="right">{startDateDisplay}</TableCell>
                                            <TableCell align="right">
                                                <div className='edit-icon'>
                                                    <EditIcon onClick={() => editClick('startDate')} />
                                                </div>
                                            </TableCell>
                                        </>
                                        :
                                        <>
                                            <TableCell align="right">
                                                <TextField type='date' id="edit-startDate" value={startDateInput} onChange={startDateChange} />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button onClick={handleSaveDate}>Save</Button>
                                            </TableCell>
                                        </>}
                                </TableRow>
                                <TableRow key={endDateDisplay}>
                                    <TableCell component="th" scope="row">
                                        End Date
                        </TableCell>
                                    {!edit.endDate
                                        ? <>
                                            <TableCell align="right">{endDateDisplay}</TableCell>
                                            <TableCell align="right">
                                                <div className='edit-icon'>
                                                    <EditIcon onClick={() => editClick('endDate')} />
                                                </div>
                                            </TableCell>
                                        </>
                                        :
                                        <>
                                            <TableCell align="right">
                                                <TextField type='date' id="edit-endDate" value={endDateInput} onChange={endDateChange} />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button onClick={handleSaveDate}>Save</Button>
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