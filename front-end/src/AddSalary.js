import React, { useState, useContext } from 'react';
import apiBaseUrl from './config';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Context from './Context';
import { Typography } from '@material-ui/core';
import { KeyboardDatePicker } from "@material-ui/pickers";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));


const AddSalary = () => {

    const { selectedPlan, setSelectedPlan, setOpenAddSalary, expandItem, setExpandItem } = useContext(Context)

    const startDateDefault = [selectedPlan.startDate[0], selectedPlan.startDate[1], selectedPlan.startDate[2]]
    const endDateDefault = [selectedPlan.endDate[0], selectedPlan.endDate[1], selectedPlan.endDate[2]]
    const startDateInputDefault = new Date(selectedPlan.startDate[0], selectedPlan.startDate[1], selectedPlan.startDate[2])
    const endDateInputDefault = new Date(selectedPlan.endDate[0], selectedPlan.endDate[1], selectedPlan.endDate[2])


    const [name, setName] = useState('')
    const [amountPerYear, setAmountPerYear] = useState(null)
    const [amountPerYearInput, setAmountPerYearInput] = useState('')
    const [taxRate, setTaxRate] = useState(null)
    const [taxRateInput, setTaxRateInput] = useState('')
    const [afterTaxAmount, setAfterTaxAmount] = useState('')
    const [startDate, setStartDate] = useState(startDateDefault)
    const [endDate, setEndDate] = useState(endDateDefault)
    const [startDateInput, setStartDateInput] = useState(startDateInputDefault)
    const [endDateInput, setEndDateInput] = useState(endDateInputDefault)

    const classes = useStyles();

    const addSalarySubmit = async (e) => {
        e.preventDefault()
        setOpenAddSalary(false)
        const res = await fetch(`${apiBaseUrl}/salaries`, {
            method: 'POST',
            body: JSON.stringify({
                name, startDate, endDate, amountPerYear, taxRate, afterTaxAmount, planId: selectedPlan._id
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

            setExpandItem({ ...expandItem, [parsedRes.newSalary._id]: false })

            setSelectedPlan(parsedRes.plan)
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

    const startDateChange = date => {
        // console.log(typeof date.c.month)

        setStartDateInput(date)

        if (date.c) {
            setStartDate([date.c.year, date.c.month - 1, date.c.day])
        }


    }

    const endDateChange = date => {
        setEndDateInput(date)

        if (date.c) {
            setEndDate([date.c.year, date.c.month - 1, date.c.day])
        }

    }

    return (
        <>
            <Typography variant='h6'>Add Salary</Typography>
            <form className={classes.root} noValidate autoComplete="off">
                <TextField id="name" label="Name" value={name} onChange={nameChange} />
                <TextField type='number' id="amount-per-year" label="Amount Per Year" value={amountPerYearInput} onChange={amountPerYearChange} />
                <TextField type='number' id="tax" label="Tax Rate" value={taxRateInput} onChange={taxChange} />
                <TextField type='number' id="after-tax-amount" label="Amount After Taxes" value={afterTaxAmount} />
                {/* <TextField type='date' id="start-date" value={startDateInput} onChange={startDateChange} /> */}
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
                {/* <TextField type='date' id="end-date" value={endDateInput} onChange={endDateChange} /> */}
                <Button variant="contained" onClick={addSalarySubmit}>Submit</Button>
            </form>
        </>
    );
}

export default AddSalary;
