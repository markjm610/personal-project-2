import React, { useContext } from 'react'
import { Redirect } from 'react-router-dom'
import { Button } from '@material-ui/core'
import apiBaseUrl from './config';
import Context from './Context'


const DeletePlan = () => {

    const { selectedPlan, history } = useContext(Context)

    const deletePlanClick = async () => {
        const res = await fetch(`${apiBaseUrl}/plans/${selectedPlan._id}`, {
            method: 'DELETE'
        })

        if (res.ok) {
            window.location.href = '/main'
        }
    }

    return (
        <>
            {selectedPlan._id && <Button variant='outlined' style={{ color: 'white' }} onClick={deletePlanClick}>Delete Plan</Button>}

        </>
    )
}

export default DeletePlan