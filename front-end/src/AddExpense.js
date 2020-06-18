import React, { useState, useContext } from 'react';
import apiBaseUrl from './config';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Context from './Context';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

const AddExpense = () => {
    const classes = useStyles();

    const { displayedPlan } = useContext(Context)

    const [name, setName] = useState('')
    const [amount, setAmount] = useState(null)
    const [amountInput, setAmountInput] = useState('')
    const [date, setDate] = useState(null)
    const [dateInput, setDateInput] = useState('')
    const [repeatingInterval, setRepeatingInterval] = useState(null)
    const [repeatingIntervalInput, setRepeatingIntervalInput] = useState('')

    const addExpenseSubmit = async (e) => {
        e.preventDefault()
        // const res = await fetch(`${apiBaseUrl}/salaries`, {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         name, startDate, endDate, amountPerYear, taxRate, afterTaxAmount, planId: displayedPlan.id
        //     }),
        //     headers: {
        //         "Content-Type": 'application/json',
        //     }
        // })

        // const parsedRes = await res.json()
        // console.log(parsedRes)
        //     name: { type: String, required: true },
        //     date: { type: Date, required: true },
        //     amount: { type: Number, required: true },
        //     repeatingInterval: { type: Number, required: true },
        //     planId: { type: mongoose.Types.ObjectId, required: true, ref: 'Plan' }
        // })
    }

    const nameChange = (e) => {
        setName(e.target.value)
    }

    const amountChange = (e) => {

        const amountFloat = parseFloat(e.target.value)
        setAmount(amountFloat)
        setAmountInput(e.target.value)


    }

    const repeatingIntervalChange = e => {


    }

    const dateChange = e => {
        setDateInput(e.target.value)
        const stringDateArr = e.target.value.split('-')
        const numDateArr = stringDateArr.map(number => {
            return parseInt(number)
        })
        setDate(new Date(numDateArr[0], numDateArr[1] - 1, numDateArr[2]))

    }

    return (
        <>
            <div>Add Expense</div>
            <form className={classes.root} noValidate autoComplete="off">
                <TextField id="name" label="Name" value={name} onChange={nameChange} />
                <TextField type='date' id="date" value={dateInput} onChange={dateChange} />
                <TextField type='number' id="amount" label="Amount" value={amountInput} onChange={amountChange} />
                <TextField type='number' id="repeating-interval" label="How often does it repeat?" value={repeatingIntervalInput} onChange={repeatingIntervalChange} />
                <Button variant="contained" onClick={addExpenseSubmit}>Submit</Button>
            </form>
        </>
    )

}

export default AddExpense;