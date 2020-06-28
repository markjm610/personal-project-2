import React, { useState, useEffect, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import apiBaseUrl from './config';
import Context from './Context'
import ToggleSalary from './ToggleSalary';
import ToggleExpense from './ToggleExpense';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        // maxWidth: 500,
        backgroundColor: theme.palette.background.paper,
    },
    headings: {
        padding: 5
    }
}));


const Sidebar = () => {

    const { selectedPlan, expandItem, setExpandItem } = useContext(Context)

    const classes = useStyles();
    const [checked, setChecked] = React.useState([]);
    const [salaries, setSalaries] = useState([])
    const [expenses, setExpenses] = useState([])
    const [dropdown, setDropdown] = useState(false)

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    useEffect(() => {
        if (selectedPlan._id) {
            const getItems = async () => {
                const res = await fetch(`${apiBaseUrl}/plans/${selectedPlan._id}/items`)
                const items = await res.json()
                const salaries = items.salaries
                const expenses = items.expenses

                setSalaries(salaries)
                setExpenses(expenses)

                // expenses.forEach(expense => {
                //     setExpandItem({ ...expandItem, [expense._id]: false })
                // })
            }

            getItems()
        }

    }, [selectedPlan])



    return (
        <div className='sidebar-container'>
            {salaries.length !== 0 && <Typography className={classes.headings} variant='h6'>Salaries</Typography>}
            {salaries.map(({ _id, name, displayed, amountPerYear, afterTaxAmount, taxRate, startDate, endDate }) => {
                return <ToggleSalary
                    key={_id}
                    id={_id}
                    name={name}
                    displayed={displayed}
                    amountPerYear={amountPerYear}
                    afterTaxAmount={afterTaxAmount}
                    taxRate={taxRate}
                    startDate={startDate}
                    endDate={endDate} />
            })}
            {expenses.length !== 0 && <Typography className={classes.headings} variant='h6'>Expenses</Typography>}
            {expenses.map(({ description, _id, displayed, date, repeatingInterval, amount }) => {
                return <ToggleExpense
                    key={_id}
                    id={_id}
                    description={description}
                    displayed={displayed}
                    date={date}
                    repeatingInterval={repeatingInterval}
                    amount={amount} />
            })}
            {/* </List>} */}
        </div>
    )
}

export default Sidebar