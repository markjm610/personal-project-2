import React from 'react'
import { NavLink, Switch, Route } from 'react-router-dom'
import AddBoxIcon from '@material-ui/icons/AddBox';
import { Typography } from '@material-ui/core';
import InfoDisplay from './InfoDisplay';
import AddItem from './AddItem';

const AddOrView = () => {
    return (
        <>
            <NavLink to='/add-item'>
                <AddBoxIcon fontSize='large' />
                <Typography>Add Item</Typography>
            </NavLink>
            <NavLink to='/view-info'>
                View Info
            </NavLink>
            <Switch>
                <Route exact path='/add-item' component={AddItem} />
                <Route exact path='/view-info' component={InfoDisplay} />
            </Switch>
        </>
    )
}

export default AddOrView