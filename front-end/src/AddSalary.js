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


const AddSalary = () => {

    const { displayedPlan } = useContext(Context)

    const [name, setName] = useState('')
    const [amountPerYear, setAmountPerYear] = useState(null)
    const [amountPerYearInput, setAmountPerYearInput] = useState('')
    const [taxRate, setTaxRate] = useState(null)
    const [taxRateInput, setTaxRateInput] = useState('')
    const [afterTaxAmount, setAfterTaxAmount] = useState('')
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [startDateInput, setStartDateInput] = useState('')
    const [endDateInput, setEndDateInput] = useState('')

    const classes = useStyles();

    const addSalarySubmit = async (e) => {
        e.preventDefault()
        const res = await fetch(`${apiBaseUrl}/salaries`, {
            method: 'POST',
            body: JSON.stringify({
                name, startDate, endDate, amountPerYear, taxRate, afterTaxAmount, planId: displayedPlan.id
            }),
            headers: {
                "Content-Type": 'application/json',
            }
        })

        const parsedRes = await res.json()
        console.log(parsedRes)

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
            <div>Add Salary</div>
            <form className={classes.root} noValidate autoComplete="off">
                <TextField id="name" label="Name" value={name} onChange={nameChange} />
                <TextField type='number' id="amount-per-year" label="Amount Per Year" value={amountPerYearInput} onChange={amountPerYearChange} />
                <TextField type='number' id="tax" label="Tax Rate" value={taxRateInput} onChange={taxChange} />
                <TextField type='number' id="after-tax-amount" label="Amount After Taxes" value={afterTaxAmount} />
                <TextField type='date' id="start-date" value={startDateInput} onChange={startDateChange} />
                <TextField type='date' id="end-date" value={endDateInput} onChange={endDateChange} />
                <Button variant="contained" onClick={addSalarySubmit}>Submit</Button>
            </form>
        </>
    );
}

export default AddSalary;
