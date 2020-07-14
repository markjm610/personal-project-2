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
    const [dateError, setDateError] = useState(null)


    const newPlanSubmit = async () => {
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
            }


            setEndDate([date.c.year, date.c.month - 1, date.c.day])
        }
    }

    return (
        <>
            <Typography variant='h6'>New Plan</Typography>
            <form className={classes.root} noValidate autoComplete="off">
                <TextField id="name" label="Name" value={name} onChange={nameChange} />
                <KeyboardDatePicker
                    autoOk
                    variant="inline"
                    inputVariant="outlined"
                    label="Start Date"
                    format="MM/dd/yyyy"
                    value={startDateInput}
                    InputAdornmentProps={{ position: "start" }}
                    onChange={date => startDateChange(date)}
                />
                <KeyboardDatePicker
                    autoOk
                    variant="inline"
                    inputVariant="outlined"
                    label="End Date"
                    format="MM/dd/yyyy"
                    value={endDateInput}
                    InputAdornmentProps={{ position: "start" }}
                    onChange={date => endDateChange(date)}
                />
                <Button variant="contained" onClick={newPlanSubmit}>Submit</Button>
            </form>
        </>
    );
}

export default NewPlan