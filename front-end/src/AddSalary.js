import React, { useState, useContext } from 'react';
import apiBaseUrl from './config';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Context from './Context';
import { Typography, InputAdornment } from '@material-ui/core';
import { KeyboardDatePicker } from "@material-ui/pickers";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },

    }
}));


const AddSalary = () => {
    const classes = useStyles();

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
    const [amountPerYearError, setAmountPerYearError] = useState(false)
    const [nameError, setNameError] = useState(false)
    const [taxRateError, setTaxRateError] = useState(false)
    const [negativeAmount, setNegativeAmount] = useState(false)
    const [negativeTaxRate, setNegativeTaxRate] = useState(false)
    const [taxRateOver100, setTaxRateOver100] = useState(false)
    const [startAfterEnd, setStartAfterEnd] = useState(false)
    const [startDateError, setStartDateError] = useState(false)
    const [endDateError, setEndDateError] = useState(false)
    const [startDateOutOfRange, setStartDateOutOfRange] = useState(false)
    const [endDateOutOfRange, setEndDateOutOfRange] = useState(false)


    const addSalarySubmit = async (e) => {
        e.preventDefault()

        if (!amountPerYear) {
            setAmountPerYearError(true)
        }

        if (!name) {
            setNameError(true)

        }

        if (!taxRate) {
            setTaxRateError(true)

        }
        if (negativeAmount) {
            setAmountPerYearError(true)

        }

        if (negativeTaxRate) {
            setTaxRateError(true)

        }
        if (taxRateOver100) {
            setTaxRateError(true)

        }

        if (startAfterEnd) {
            setStartDateError(true)
            setEndDateError(true)
        }

        if (startDateOutOfRange) {
            setStartDateError(true)
        }

        if (endDateOutOfRange) {
            setEndDateError(true)
        }

        if (
            !amountPerYear
            || !name
            || !taxRate
            || negativeAmount
            || negativeTaxRate
            || taxRateOver100
            || startAfterEnd
            || startDateOutOfRange
            || endDateOutOfRange
        ) {
            return
        }


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
        if (nameError) {
            setNameError(false)
        }
    }

    const amountPerYearChange = (e) => {

        const amountPerYearFloat = parseFloat(e.target.value)

        if (amountPerYearFloat < 0) {
            setNegativeAmount(true)
        }
        if (amountPerYearFloat > 0 && negativeAmount) {
            setNegativeAmount(false)
        }
        setAmountPerYear(amountPerYearFloat)
        setAmountPerYearInput(e.target.value)
        if (taxRate && e.target.value) {
            if (taxRate < 0 || parseFloat(e.target.value) < 0 || taxRateOver100) {
                setAfterTaxAmount('')
            } else {
                setAfterTaxAmount(amountPerYearFloat - amountPerYearFloat * taxRate)
            }

        } else {
            setAfterTaxAmount('')
        }

        if (amountPerYearError) {
            setAmountPerYearError(false)
        }
    }

    const taxChange = (e) => {
        setTaxRateInput(e.target.value)
        const taxRateToDecimal = parseFloat(e.target.value) / 100
        if (parseFloat(e.target.value) < 0) {
            setNegativeTaxRate(true)
        }
        if (parseFloat(e.target.value) > 0 && negativeTaxRate) {
            setNegativeTaxRate(false)
        }
        if (parseFloat(e.target.value) > 100) {
            setTaxRateOver100(true)
        } else {
            if (taxRateOver100) {
                setTaxRateOver100(false)
            }
        }


        setTaxRate(taxRateToDecimal)

        if (amountPerYear && e.target.value) {
            if (amountPerYear < 0 || parseFloat(e.target.value) < 0 || parseFloat(e.target.value) > 100) {
                setAfterTaxAmount('')
            } else {
                setAfterTaxAmount(amountPerYear - amountPerYear * taxRateToDecimal)
            }

        } else {
            setAfterTaxAmount('')
        }

        if (taxRateError) {
            setTaxRateError(false)
        }

    }

    const startDateChange = date => {
        setStartDateInput(date)

        if (startDateError) {
            setStartDateError(false)
        }

        if (date.c) {
            setStartDate([date.c.year, date.c.month - 1, date.c.day])

            const startMilliseconds = new Date(date.c.year, date.c.month - 1, date.c.day).getTime()
            const endMilliseconds = new Date(endDate[0], endDate[1], endDate[2])
            if (startMilliseconds > endMilliseconds) {
                setStartAfterEnd(true)
            } else {
                if (startAfterEnd) {
                    setStartAfterEnd(false)
                }



            }

            if (startMilliseconds < startDateInputDefault || startMilliseconds > endDateInputDefault) {
                setStartDateOutOfRange(true)
            } else if (startDateOutOfRange) {
                setStartDateOutOfRange(false)
            }
        }
    }

    const endDateChange = date => {
        setEndDateInput(date)

        if (endDateError) {
            setEndDateError(false)
        }

        if (date.c) {
            setEndDate([date.c.year, date.c.month - 1, date.c.day])

            const startMilliseconds = new Date(startDate[0], startDate[1], startDate[2]).getTime()
            const endMilliseconds = new Date(date.c.year, date.c.month - 1, date.c.day)
            if (startMilliseconds > endMilliseconds) {
                setStartAfterEnd(true)
            } else {
                if (startAfterEnd) {
                    setStartAfterEnd(false)
                }
            }

            if (endMilliseconds < startDateInputDefault || endMilliseconds > endDateInputDefault) {
                setEndDateOutOfRange(true)
            } else if (endDateOutOfRange) {
                setEndDateOutOfRange(false)
            }

        }

    }

    return (
        <>
            <Typography variant='h6' style={{ marginLeft: '5px' }}>Add Salary</Typography>
            <form className={classes.root} noValidate autoComplete="off">
                <TextField
                    error={nameError}
                    id="name"
                    label="Name"
                    value={name}
                    onChange={nameChange}
                    InputProps={{
                        className: classes.input
                    }}

                />
                <TextField
                    error={amountPerYearError}
                    InputProps={{
                        className: classes.input
                    }}
                    type='number'
                    id="amount-per-year"
                    label="Amount Per Year"
                    value={amountPerYearInput}
                    onChange={amountPerYearChange}
                    helperText={negativeAmount && 'Amount cannot be negative'}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                $
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    error={taxRateError}
                    InputProps={{
                        className: classes.input
                    }}
                    type='number'
                    id="tax"
                    label="Tax Rate"
                    value={taxRateInput}
                    onChange={taxChange}
                    helperText={negativeTaxRate && 'Tax rate cannot be negative' || taxRateOver100 && 'Invalid tax rate'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">
                                %
                            </InputAdornment>
                        ),
                    }}
                />


                <TextField

                    type='number'
                    id="after-tax-amount"
                    label="Amount After Taxes"
                    value={parseFloat(afterTaxAmount).toFixed(2)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                $
                            </InputAdornment>
                        ),
                    }}
                />

                <KeyboardDatePicker
                    required
                    error={startDateError}
                    autoOk
                    variant="inline"
                    inputVariant="outlined"
                    label="Start Date"
                    format="MM/dd/yyyy"
                    value={startDateInput}
                    InputAdornmentProps={{ position: "start" }}
                    onChange={date => startDateChange(date)}
                    helperText={
                        startAfterEnd && 'Start date must be before end date' || startDateOutOfRange && 'Dates must be during plan'
                    }
                />
                <KeyboardDatePicker
                    required
                    error={endDateError}
                    autoOk
                    variant="inline"
                    inputVariant="outlined"
                    label="End Date"
                    format="MM/dd/yyyy"
                    value={endDateInput}
                    InputAdornmentProps={{ position: "start" }}
                    onChange={date => endDateChange(date)}
                    helperText={
                        startAfterEnd && 'Start date must be before end date' || endDateOutOfRange && 'Dates must be during plan'
                    }
                />


                <Button variant="contained" onClick={addSalarySubmit}>Submit</Button>
            </form>
        </>
    );
}

export default AddSalary;
