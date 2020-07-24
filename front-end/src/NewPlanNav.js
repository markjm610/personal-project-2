import React, { useState, useEffect, useContext } from 'react';
import apiBaseUrl from './config';
import Context from './Context';
import Button from '@material-ui/core/Button';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import NewPlan from './NewPlan'
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { IconButton } from '@material-ui/core';


const useStyles = makeStyles({
    list: {
        width: 'auto',
        backgroundColor: 'lightgray'
    },
    fullList: {
        width: 'auto',
    },
});


const NewPlanNav = () => {
    const classes = useStyles();

    const { currentUser } = useContext(Context)
    const { openNewPlan, setOpenNewPlan } = useContext(Context)

    const toggleDrawer = () => {
        setOpenNewPlan(!openNewPlan);
    };

    const list = (anchor) => (
        <div
            className={clsx(classes.list, {
                [classes.fullList]: anchor === 'top' || anchor === 'bottom',
            })}
            role="presentation"
        >
            <NewPlan />
        </div>
    );

    return (
        <div
        // style={{ marginBottom: '10px' }}
        >
            <IconButton color='inherit' onClick={toggleDrawer}><AddCircleOutlineIcon /></IconButton>
            <Drawer anchor='top' open={openNewPlan} onClose={toggleDrawer}>
                {list('top')}
            </Drawer>
        </div>
    )
}

export default NewPlanNav