import React, { useState, useContext } from 'react'
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import apiBaseUrl from './config';
import Context from './Context';



const ToggleSalary = ({ id, name, displayed }) => {

    const [checked, setChecked] = useState(displayed)
    const { selectedPlan, setSelectedPlan } = useContext(Context)

    const handleToggle = async () => {

        const res = await fetch(`${apiBaseUrl}/plans/${selectedPlan._id}/salaries/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                displayed: !checked
            }),
            headers: {
                "Content-Type": 'application/json',
            }
        })
        if (res.ok) {
            const plan = await res.json()
            const dateObjData = plan.graphData.map(datapoint => {
                return { x: new Date(datapoint.x), y: datapoint.y }
            })

            plan.graphData = dateObjData
            setSelectedPlan(plan)

            setChecked(!checked)
        }

    }


    const labelId = `checkbox-list-secondary-label-${name}`;

    return (
        <ListItem key={name} button>
            <ListItemText id={labelId} primary={`${name}`} />
            <ListItemSecondaryAction>
                <Checkbox
                    edge="end"
                    onChange={handleToggle}
                    checked={checked}
                    inputProps={{ 'aria-labelledby': labelId }}
                />
            </ListItemSecondaryAction>
        </ListItem>
    )
}

export default ToggleSalary