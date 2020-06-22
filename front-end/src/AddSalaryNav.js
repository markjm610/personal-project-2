import React, { useState, useContext } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AddSalary from './AddSalary';
import MenuItem from '@material-ui/core/MenuItem';
import Context from './Context';

const useStyles = makeStyles({
    list: {
        width: 'auto',
    },
    fullList: {
        width: 'auto',
    },
});

const AddSalaryNav = () => {
    const classes = useStyles();
    const { openAddSalary, setOpenAddSalary } = useContext(Context)

    const toggleDrawer = () => {
        setOpenAddSalary(!openAddSalary);
    };

    const list = (anchor) => (
        <div
            className={clsx(classes.list, {
                [classes.fullList]: anchor === 'top' || anchor === 'bottom',
            })}
            role="presentation"
        >
            <AddSalary />
        </div>
    );

    return (
        <div>
            <MenuItem onClick={toggleDrawer}>Add Salary</MenuItem>
            <Drawer anchor='top' open={openAddSalary} onClose={toggleDrawer}>
                {list('top')}
            </Drawer>
        </div>
    );
}

export default AddSalaryNav