import React, { useState, useContext } from 'react';
import apiBaseUrl from './config';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Context from './Context';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Typography } from '@material-ui/core';
import { KeyboardDatePicker } from "@material-ui/pickers";


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

const AddExpense = () => {
    const classes = useStyles();

    const { selectedPlan, setSelectedPlan, setOpenAddExpense } = useContext(Context)

    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState(null)
    const [amountInput, setAmountInput] = useState('')
    const [date, setDate] = useState(null)
    const [dateInput, setDateInput] = useState(new Date())
    const [repeatingInterval, setRepeatingInterval] = useState(null)
    const [checkedRepeat, setCheckedRepeat] = useState(false)

    const addExpenseSubmit = async (e) => {
        e.preventDefault()
        setOpenAddExpense(false)
        const res = await fetch(`${apiBaseUrl}/expenses`, {
            method: 'POST',
            body: JSON.stringify({
                description, date, amount, repeatingInterval, planId: selectedPlan._id
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
        }


    }

    const descriptionChange = (e) => {
        setDescription(e.target.value)
    }

    const amountChange = (e) => {

        const amountFloat = parseFloat(e.target.value)
        setAmount(amountFloat)
        setAmountInput(e.target.value)


    }

    const dateChange = date => {
        setDateInput(date)
        if (date.c) {
            setDate([date.c.year, date.c.month - 1, date.c.day])
        }
    }

    const checkChange = e => {
        if (!checkedRepeat) {
            setCheckedRepeat(true)
        } else {
            setCheckedRepeat(false)
        }
        if (repeatingInterval) {
            setRepeatingInterval(null)
        }
    }

    const repeatingIntervalChange = e => {
        setRepeatingInterval(e.target.value)
    }

    return (
        <>
            <Typography variant='h6'>Add Expense</Typography>
            <form className={classes.root} noValidate autoComplete="off">
                <TextField id="name" label="Description" value={description} onChange={descriptionChange} />
                <KeyboardDatePicker
                    autoOk
                    variant="inline"
                    inputVariant="outlined"
                    label="Date"
                    format="MM/dd/yyyy"
                    value={dateInput}
                    InputAdornmentProps={{ position: "start" }}
                    onChange={date => dateChange(date)}
                />
                <TextField type='number' id="amount" label="Amount" value={amountInput} onChange={amountChange} />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={checkedRepeat}
                            onChange={checkChange}
                            name="check-if-repeating"
                            color="primary"
                        />
                    }
                    label="Repeating expense?"
                />
                {checkedRepeat &&
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">How often?</InputLabel>
                        <Select
                            labelId="repeating-interval"
                            id="repeating-interval"
                            value={repeatingInterval || ''}
                            onChange={repeatingIntervalChange}
                        >
                            <MenuItem value={'Daily'}>Daily</MenuItem>
                            <MenuItem value={'Weekly'}>Weekly</MenuItem>
                            <MenuItem value={'Monthly'}>Monthly</MenuItem>
                            <MenuItem value={'Yearly'}>Yearly</MenuItem>
                        </Select>
                    </FormControl>
                    // <TextField type='number' id="repeating-interval" label="How often does it repeat?" value={repeatingIntervalInput} onChange={repeatingIntervalChange} />
                }
                <Button variant="contained" onClick={addExpenseSubmit}>Submit</Button>
            </form>
        </>
    )

}

export default AddExpense;