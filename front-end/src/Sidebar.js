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

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
}));


const Sidebar = () => {

    const { selectedPlan } = useContext(Context)

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
                console.log(expenses)
            }

            getItems()
        }

    }, [selectedPlan])




    return (
        <div className='sidebar-container'>
            {selectedPlan._id && <List dense className={classes.root}>
                {salaries.map((salary) => {
                    return <ToggleSalary key={salary.name} id={salary._id} name={salary.name} displayed={salary.displayed} />
                })}
                {expenses.map((expense) => {
                    const labelId = `checkbox-list-secondary-label-${expense}`;
                    return (
                        <ListItem key={expense} button>
                            <ListItemText id={labelId} primary={`${expense.description}`} />
                            <ListItemSecondaryAction>
                                <Checkbox
                                    edge="end"
                                    onChange={handleToggle(expense)}
                                    checked={checked.indexOf(expense) !== -1}
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>)
                })}
            </List>}
        </div>
    )
}

export default Sidebar