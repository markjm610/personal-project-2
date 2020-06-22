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

    const { displayedPlan, setSelectedPlan, setOpenAddExpense } = useContext(Context)

    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState(null)
    const [amountInput, setAmountInput] = useState('')
    const [date, setDate] = useState(null)
    const [dateInput, setDateInput] = useState('')
    const [repeatingInterval, setRepeatingInterval] = useState(null)
    const [repeatingIntervalInput, setRepeatingIntervalInput] = useState('')
    const [checkedRepeat, setCheckedRepeat] = useState(false)

    const addExpenseSubmit = async (e) => {
        e.preventDefault()
        const res = await fetch(`${apiBaseUrl}/expenses`, {
            method: 'POST',
            body: JSON.stringify({
                description, date, amount, repeatingInterval, planId: displayedPlan.id
            }),
            headers: {
                "Content-Type": 'application/json',
            }
        })
        if (res.ok) {
            setOpenAddExpense(false)

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

    const dateChange = e => {
        setDateInput(e.target.value)
        const stringDateArr = e.target.value.split('-')
        const numDateArr = stringDateArr.map((number, i) => {
            if (i === 1) {
                return parseInt(number) - 1
            }
            return parseInt(number)
        })
        // setDate(new Date(numDateArr[0], numDateArr[1] - 1, numDateArr[2]))
        setDate(numDateArr)
    }

    const checkChange = e => {
        if (!checkedRepeat) {
            setCheckedRepeat(true)
        } else {
            setCheckedRepeat(false)
        }

    }

    const repeatingIntervalChange = e => {
        setRepeatingInterval(e.target.value)
    }

    return (
        <>
            <div>Add Expense</div>
            <form className={classes.root} noValidate autoComplete="off">
                <TextField id="name" label="Description" value={description} onChange={descriptionChange} />
                <TextField type='date' id="date" value={dateInput} onChange={dateChange} />
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