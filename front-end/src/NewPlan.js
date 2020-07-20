import React, { useState, useEffect, useContext } from 'react';
import apiBaseUrl from './config';
import Context from './Context';
import Button from '@material-ui/core/Button';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import PlanNav from './PlanNav';
import { KeyboardDatePicker } from "@material-ui/pickers";
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

const NewPlan = () => {
    const classes = useStyles();

    const { currentUser, setOpenNewPlan, currentUserPlans, setCurrentUserPlans } = useContext(Context)

    const newDateArr = [new Date().getFullYear(), new Date().getMonth(), new Date().getDate()]

    const [name, setName] = useState('')
    const [startDate, setStartDate] = useState(newDateArr)
    const [endDate, setEndDate] = useState(newDateArr)
    const [startDateInput, setStartDateInput] = useState(new Date())
    const [endDateInput, setEndDateInput] = useState(new Date())
    const [dateError, setDateError] = useState(false)
    const [nameError, setNameError] = useState(false)

    const newPlanSubmit = async () => {


        if (!name) {
            setNameError(true)
        }

        if (new Date(startDate[0], startDate[1], startDate[2]).getTime() === new Date(endDate[0], endDate[1], endDate[2]).getTime()) {
            setDateError('start date === end date')
        }

        if (!name ||
            dateError ||
            new Date(startDate[0], startDate[1], startDate[2]).getTime() === new Date(endDate[0], endDate[1], endDate[2]).getTime()) {
            return
        }

        setOpenNewPlan(false)
        const res = await fetch(`${apiBaseUrl}/plans`, {
            method: 'POST',
            body: JSON.stringify({
                name, startDate, endDate, userId: currentUser._id
            }),
            headers: {
                "Content-Type": 'application/json',
            }
        })
        if (res.ok) {
            const newPlan = await res.json()
            const listOfPlans = [...currentUserPlans]
            listOfPlans.push(newPlan)
            setCurrentUserPlans(listOfPlans)
        }
    }


    const nameChange = (e) => {
        setName(e.target.value)
        if (nameError) {
            setNameError(false)
        }
    }

    const startDateChange = date => {

        setStartDateInput(date)
        if (date.c) {



            if (endDate[0] - date.c.year > 30) {
                setDateError('plan too long')
            } else if (endDate[0] - date.c.year === 30 && date.c.month - 1 - endDate[1] < 0) {
                setDateError('plan too long')
            } else if (endDate[0] - date.c.year === 30 && date.c.month - 1 - endDate[1] === 0 && date.c.day - endDate[2] < 0) {
                setDateError('plan too long')
            } else {
                if (dateError === 'plan too long') {
                    setDateError(false)
                }
            }
            const startMilliseconds = new Date(date.c.year, date.c.month - 1, date.c.day).getTime()
            const endMilliseconds = new Date(endDate[0], endDate[1], endDate[2])
            if (startMilliseconds > endMilliseconds) {
                setDateError('start after end')
            } else {
                if (dateError === 'start after end') {
                    setDateError(false)
                }
            }
            if (dateError === 'start date === end date') {
                if (startMilliseconds !== endMilliseconds) {
                    setDateError(false)
                }
            }
            setStartDate([date.c.year, date.c.month - 1, date.c.day])

        }
    }

    const endDateChange = date => {
        setEndDateInput(date)

        if (date.c) {

            if (date.c.year - startDate[0] > 30) {
                setDateError('plan too long')
            } else if (date.c.year - startDate[0] === 30 && date.c.month - 1 - startDate[1] > 0) {
                setDateError('plan too long')
            } else if (date.c.year - startDate[0] === 30 && date.c.month - 1 - startDate[1] === 0 && date.c.day - startDate[2] > 0) {
                setDateError('plan too long')
            } else {
                if (dateError === 'plan too long') {
                    setDateError(false)
                }
            }

            const startMilliseconds = new Date(startDate[0], startDate[1], startDate[2])
            const endMilliseconds = new Date(date.c.year, date.c.month - 1, date.c.day).getTime()

            if (startMilliseconds > endMilliseconds) {
                setDateError('start after end')
            } else {
                if (dateError === 'start after end') {
                    setDateError(false)
                }
            }

            if (dateError === 'start date === end date') {
                if (startMilliseconds !== endMilliseconds) {
                    setDateError(false)
                }
            }
            setEndDate([date.c.year, date.c.month - 1, date.c.day])
        }
    }

    return (
        <>
            <Typography variant='h6' style={{ marginLeft: '5px' }}>New Plan</Typography>
            <form className={classes.root} noValidate autoComplete="off">

                <TextField
                    error={nameError}
                    id="name"
                    label="Name"
                    value={name}
                    onChange={nameChange}
                    helperText={nameError && 'Must enter name'}
                />

                <KeyboardDatePicker
                    error={!!dateError}
                    autoOk
                    variant="inline"
                    inputVariant="outlined"
                    label="Start Date"
                    format="MM/dd/yyyy"
                    value={startDateInput}
                    InputAdornmentProps={{ position: "start" }}
                    onChange={date => startDateChange(date)}
                    helperText={
                        dateError === 'plan too long' && 'Maximum length is 30 years'
                        || dateError === 'start after end' && 'Start date must be before end date'
                        || dateError === 'start date === end date' && 'Start date must be before end date'
                    }
                />

                <KeyboardDatePicker
                    error={!!dateError}
                    autoOk
                    variant="inline"
                    inputVariant="outlined"
                    label="End Date"
                    format="MM/dd/yyyy"
                    value={endDateInput}
                    InputAdornmentProps={{ position: "start" }}
                    onChange={date => endDateChange(date)}
                    helperText={
                        dateError === 'plan too long' && 'Maximum length is 30 years'
                        || dateError === 'start after end' && 'Start date must be before end date'
                        || dateError === 'start date === end date' && 'Start date must be before end date'
                    }
                />

                <Button variant="contained" onClick={newPlanSubmit}>Submit</Button>

            </form>
        </>
    );
}

export default NewPlan