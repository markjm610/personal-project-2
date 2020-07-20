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
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Typography, InputAdornment } from '@material-ui/core';
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

    const { selectedPlan, setSelectedPlan, setOpenAddExpense, expandItem, setExpandItem } = useContext(Context)

    const dateDefault = [selectedPlan.startDate[0], selectedPlan.startDate[1], selectedPlan.startDate[2]]
    const dateInputDefault = new Date(selectedPlan.startDate[0], selectedPlan.startDate[1], selectedPlan.startDate[2])

    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState(null)
    const [amountInput, setAmountInput] = useState('')
    const [date, setDate] = useState(dateDefault)
    const [dateInput, setDateInput] = useState(dateInputDefault)
    const [repeatingInterval, setRepeatingInterval] = useState(null)
    const [checkedRepeat, setCheckedRepeat] = useState(false)
    const [amountError, setAmountError] = useState(false)
    const [descriptionError, setDescriptionError] = useState(false)
    const [negativeAmount, setNegativeAmount] = useState(false)

    const addExpenseSubmit = async (e) => {
        e.preventDefault()


        if (!amount) {
            setAmountError(true)
        }

        if (!description) {
            setDescriptionError(true)

        }

        if (negativeAmount) {
            setAmountError(true)
        }


        if (!amount || !description || negativeAmount) {
            return
        }




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


            const parsedRes = await res.json()
            const dateObjData = parsedRes.plan.graphData.map(datapoint => {
                return { x: new Date(datapoint.x), y: datapoint.y }
            })

            parsedRes.plan.graphData = dateObjData

            setExpandItem({ ...expandItem, [parsedRes.newExpense._id]: false })

            setSelectedPlan(parsedRes.plan)
        }


    }

    const descriptionChange = (e) => {
        setDescription(e.target.value)
        if (descriptionError) {
            setDescriptionError(false)
        }
    }

    const amountChange = (e) => {

        const amountFloat = parseFloat(e.target.value)
        setAmount(amountFloat)
        setAmountInput(e.target.value)

        if (amountError) {
            setAmountError(false)
        }
        if (amountFloat < 0) {
            setNegativeAmount(true)
        }
        if (amountFloat > 0 && negativeAmount) {
            setNegativeAmount(false)
        }
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
            <Typography variant='h6' style={{ marginLeft: '5px' }}>Add Expense</Typography>
            <form className={classes.root} noValidate autoComplete="off">
                <TextField
                    id="name"
                    error={descriptionError}
                    label="Description"
                    value={description}
                    onChange={descriptionChange}
                />
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
                <TextField
                    error={amountError}
                    type='number'
                    id="amount"
                    label="Amount"
                    value={amountInput}
                    onChange={amountChange}
                    helperText={negativeAmount && 'Amount cannot be negative'}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                $
                            </InputAdornment>
                        ),
                    }}
                />
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

                }
                <Button variant="contained" onClick={addExpenseSubmit}>Submit</Button>
            </form>
        </>
    )

}

export default AddExpense;