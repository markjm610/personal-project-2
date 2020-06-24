import React, { useContext } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AddExpense from './AddExpense';
import MenuItem from '@material-ui/core/MenuItem';
import Context from './Context';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles({
    list: {
        width: 'auto',
    },
    fullList: {
        width: 'auto',
    },
});

const AddExpenseNav = () => {
    const classes = useStyles();
    const { openAddExpense, setOpenAddExpense, selectedPlan } = useContext(Context)

    const toggleDrawer = () => {
        setOpenAddExpense(!openAddExpense);
    };

    const list = (anchor) => (
        <div
            className={clsx(classes.list, {
                [classes.fullList]: anchor === 'top' || anchor === 'bottom',
            })}
            role="presentation"
        >
            <AddExpense />
        </div>
    );

    return (
        <div>
            {selectedPlan._id &&
                <>
                    <Button variant='outlined' onClick={toggleDrawer}>Add Expense</Button>
                    <Drawer anchor='top' open={openAddExpense} onClose={toggleDrawer}>
                        {list('top')}
                    </Drawer>
                </>
            }

        </div>
    );
}

export default AddExpenseNav