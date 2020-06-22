import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AddSalary from './AddSalary';
import MenuItem from '@material-ui/core/MenuItem';

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
    const [openDrawer, setOpenDrawer] = useState(false);

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setOpenDrawer(open);
    };

    const list = (anchor) => (
        <div
            className={clsx(classes.list, {
                [classes.fullList]: anchor === 'top' || anchor === 'bottom',
            })}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <AddSalary />
        </div>
    );

    return (
        <div>
            <MenuItem onClick={toggleDrawer('top', true)}>Add Salary</MenuItem>
            <Drawer anchor='top' open={openDrawer} onClose={toggleDrawer('top', false)}>
                {list('top')}
            </Drawer>
        </div>
    );
}

export default AddSalaryNav