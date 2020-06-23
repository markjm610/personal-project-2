import React, { useState, useEffect, useContext } from 'react';
import apiBaseUrl from './config';
import Context from './Context';
import Button from '@material-ui/core/Button';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import PlanNav from './PlanNav';


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

    const { currentUser, setOpenNewPlan } = useContext(Context)

    const [name, setName] = useState('')
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [startDateInput, setStartDateInput] = useState('')
    const [endDateInput, setEndDateInput] = useState('')

    const newPlanSubmit = async () => {
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
            setOpenNewPlan(false)
        }
    }


    const nameChange = (e) => {
        setName(e.target.value)
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

        setStartDate(numDateArr)
    }

    const endDateChange = e => {
        setEndDateInput(e.target.value)
        const stringDateArr = e.target.value.split('-')
        const numDateArr = stringDateArr.map((number, i) => {
            if (i === 1) {
                return parseInt(number) - 1
            }
            return parseInt(number)
        })

        setEndDate(numDateArr)
    }

    return (
        <>
            <div>New Plan</div>
            <form className={classes.root} noValidate autoComplete="off">
                <TextField id="name" label="Name" value={name} onChange={nameChange} />
                <TextField type='date' id="start-date" value={startDateInput} onChange={startDateChange} />
                <TextField type='date' id="end-date" value={endDateInput} onChange={endDateChange} />
                <Button variant="contained" onClick={newPlanSubmit}>Submit</Button>
            </form>
        </>
    );
}

export default NewPlan