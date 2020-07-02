import React, { useContext } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AddSalary from './AddSalary';
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

const AddSalaryNav = () => {
    const classes = useStyles();
    const { openAddSalary, setOpenAddSalary, selectedPlan, singleMode } = useContext(Context)

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

        <div className='add-salary-button'>
            {selectedPlan._id && !singleMode &&
                <>
                    <Button variant='outlined' onClick={toggleDrawer} style={{ color: 'white', border: 'solid 1px rgb(110, 211, 43)' }}>Add Salary</Button>
                    <Drawer anchor='top' open={openAddSalary} onClose={toggleDrawer}>
                        {list('top')}
                    </Drawer>
                </>
            }
        </div >

    );
}

export default AddSalaryNav