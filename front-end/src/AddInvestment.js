// name: { type: String, required: true },
// date: { type: Date, required: true },
// amount: { type: Number, required: true },
// interestRate: { type: Number, required: true },
// sellDate: { type: Number },
// planId: { type: mongoose.Types.ObjectId, required: true, ref: 'Plan' }

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


const AddInvestment = () => {

    const { selectedPlan, setSelectedPlan, setOpenAddInvestment } = useContext(Context)

    const [name, setName] = useState('')
    const [amount, setAmount] = useState(null)
    const [date, setdate] = useState(null)
    const [sellDate, setSellDate] = useState(null)

    const [startDateInput, setStartDateInput] = useState('')
    const [endDateInput, setEndDateInput] = useState('')

    const classes = useStyles();

    const addInvestmentSubmit = async (e) => {
        e.preventDefault()
        const res = await fetch(`${apiBaseUrl}/investments`, {
            method: 'POST',
            body: JSON.stringify({
                name, startDate, endDate, amountPerYear, taxRate, afterTaxAmount, planId: selectedPlan._id
            }),
            headers: {
                "Content-Type": 'application/json',
            }
        })
        if (res.ok) {
            setOpenAddInvestment(false)
            const plan = await res.json()
            const dateObjData = plan.graphData.map(datapoint => {
                return { x: new Date(datapoint.x), y: datapoint.y }
            })

            plan.graphData = dateObjData

            setSelectedPlan(plan)
        }


    }

    const nameChange = (e) => {
        setName(e.target.value)
    }

    const amountPerYearChange = (e) => {

        const amountPerYearFloat = parseFloat(e.target.value)
        setAmountPerYear(amountPerYearFloat)
        setAmountPerYearInput(e.target.value)
        if (taxRate && e.target.value) {
            console.log(amountPerYear)
            console.log(taxRate)
            setAfterTaxAmount(amountPerYearFloat - amountPerYearFloat * taxRate)
        } else {
            setAfterTaxAmount('')
        }


    }

    const taxChange = (e) => {
        setTaxRateInput(e.target.value)
        const taxRateToDecimal = parseFloat(e.target.value) / 100
        setTaxRate(taxRateToDecimal)
        if (amountPerYear && e.target.value) {
            setAfterTaxAmount(amountPerYear - amountPerYear * taxRateToDecimal)
        } else {
            setAfterTaxAmount('')
        }

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
        // setStartDate(new Date(numDateArr[0], numDateArr[1] - 1, numDateArr[2]))
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
        // setEndDate(new Date(numDateArr[0], numDateArr[1] - 1, numDateArr[2]))
        setEndDate(numDateArr)
    }

    return (
        <>
            <div>Add Investment</div>
            <form className={classes.root} noValidate autoComplete="off">
                <TextField id="name" label="Name" value={name} onChange={nameChange} />
                <TextField type='number' id="amount" label="Amount" value={amountPerYearInput} onChange={amountPerYearChange} />
                <TextField type='number' id="after-tax-amount" label="Amount After Taxes" value={afterTaxAmount} />
                <TextField type='date' id="start-date" value={startDateInput} onChange={startDateChange} />
                <TextField type='date' id="end-date" value={endDateInput} onChange={endDateChange} />
                <Button variant="contained" onClick={addInvestmentSubmit}>Submit</Button>
            </form>
        </>
    );
}

export default AddInvestment;
