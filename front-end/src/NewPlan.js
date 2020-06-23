import React, { useState, useEffect, useContext } from 'react';
import apiBaseUrl from './config';
import Context from './Context';
import Button from '@material-ui/core/Button';




const NewPlan = () => {

    const { currentUser } = useContext(Context)

    const newPlanClick = async () => {
        const res = await fetch(`${apiBaseUrl}/plans`, {
            method: 'POST',
            body: JSON.stringify({
                name: 'Test Plan', startDate: [2020, 1, 1], endDate: [2024, 1, 1], userId: currentUser._id
            }),
            headers: {
                "Content-Type": 'application/json',
            }
        })

        const plan = await res.json()
    }

    return (
        <Button color="inherit" onClick={newPlanClick}>New Plan</Button>
    )
}

export default NewPlan