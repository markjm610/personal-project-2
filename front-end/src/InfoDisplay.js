import React, { useState, useEffect, useContext } from 'react';
import Context from './Context';
import apiBaseUrl from './config';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },

});

function createRowSalary(name, amountPerYear, taxRate, afterTaxAmount) {
    return { name, amountPerYear, taxRate, afterTaxAmount };
}

function createRowExpense(description, amount, repeatingInterval) {
    return { description, amount, repeatingInterval };
}


const InfoDisplay = () => {
    const classes = useStyles();

    const { hoverData, selectedPlan } = useContext(Context)
    // `${hoverData[0].x}`
    const [infoState, setInfoState] = useState({})
    const [salaryState, setSalaryState] = useState([])
    const [expenseState, setExpenseState] = useState([])

    useEffect(() => {
        if (hoverData) {
            const fetchData = async () => {
                const res = await fetch(`${apiBaseUrl}/plans/${selectedPlan._id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        date: hoverData.x
                    }),
                    headers: {
                        "Content-Type": 'application/json',
                    }
                })

                const info = await res.json()

                setInfoState(info)
            }
            fetchData()
        }

    }, [])

    useEffect(() => {
        if (infoState.salaries) {
            let salaryRows = []
            infoState.salaries.forEach(salary => {
                salaryRows.push(createRowSalary(salary.name, salary.amountPerYear, salary.taxRate, salary.afterTaxAmount))
            })
            setSalaryState(salaryRows)
        }

    }, [infoState])

    useEffect(() => {
        if (infoState.expenses) {
            let expenseRows = []
            infoState.expenses.forEach(expense => {
                expenseRows.push(createRowExpense(expense.description, expense.amount, expense.repeatingInterval))
            })
            setExpenseState(expenseRows)
        }

    }, [infoState])

    return (
        <>
            <div className='click-salary-info'>
                {salaryState.length !== 0 && <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell className={classes.tableCell}><b>Salary</b></TableCell>
                                <TableCell align="right"><b>Amount Per Year</b></TableCell>
                                <TableCell align="right"><b>Tax Rate</b></TableCell>
                                <TableCell align="right"><b>After Tax Amount</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {salaryState.map((salary) => (
                                <TableRow key={salary.name}>
                                    <TableCell component="th" scope="row">
                                        {salary.name}
                                    </TableCell>
                                    <TableCell align="right">${salary.amountPerYear}</TableCell>
                                    <TableCell align="right">{salary.taxRate * 100}%</TableCell>
                                    <TableCell align="right">${salary.afterTaxAmount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>}
            </div>
            <div className='click-expense-info'>
                {expenseState.length !== 0 && <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Expenses (last month)</b></TableCell>
                                <TableCell align="right"><b>Amount</b></TableCell>
                                <TableCell align="right"><b>Repeats?</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {expenseState.map((expense) => (
                                <TableRow key={expense.description}>
                                    <TableCell component="th" scope="row">
                                        {expense.description}
                                    </TableCell>
                                    <TableCell align="right">${expense.amount}</TableCell>
                                    <TableCell align="right">{expense.repeatingInterval ? expense.repeatingInterval : 'No'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>}
            </div>
        </>
    )
}

export default InfoDisplay