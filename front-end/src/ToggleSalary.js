import React, { useState, useContext, useEffect } from 'react'
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import apiBaseUrl from './config';
import Context from './Context';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));


const ToggleSalary = ({ id, name, displayed, amountPerYear, afterTaxAmount, taxRate, startDate, endDate }) => {
    const classes = useStyles();

    const { selectedPlan, setSelectedPlan } = useContext(Context)
    const [checked, setChecked] = useState(displayed)
    const [infoDisplay, setInfoDisplay] = useState(false)
    // const [startDateDisplay, setStartDateDisplay] = useState(null)

    const startDateDisplay = new Date(startDate[0], startDate[1], startDate[2]).toString().slice(3, 15)
    const endDateDisplay = new Date(endDate[0], endDate[1], endDate[2]).toString().slice(3, 15)

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

    const toggleInfo = () => {
        setInfoDisplay(!infoDisplay)
    }

    const labelId = `checkbox-list-secondary-label-${name}`;

    return (
        // <>
        //     <ListItem key={name} button onClick={toggleInfo}>
        //         <ListItemText id={labelId} primary={`${name}`} />
        //         <ListItemSecondaryAction>
        //             <Checkbox
        //                 edge="end"
        //                 onChange={handleToggle}
        //                 checked={checked}
        //                 inputProps={{ 'aria-labelledby': labelId }}
        //             />
        //         </ListItemSecondaryAction>
        //     </ListItem>
        //     {infoDisplay &&
        //         <>
        //             <div>{amountPerYear}</div>
        //             <div>{taxRate * 100}%</div>
        //             <div>{afterTaxAmount}</div>
        //             <div>{startDateDisplay}</div>
        //         </>
        //     }
        // </>

        <div className={classes.root}>
            <ExpansionPanel>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.heading}>{name}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <TableBody>
                        <TableRow key={amountPerYear}>
                            <TableCell component="th" scope="row">
                                Amount Per Year
                        </TableCell>
                            <TableCell align="right">${amountPerYear}</TableCell>
                        </TableRow>
                        <TableRow key={afterTaxAmount}>
                            <TableCell component="th" scope="row">
                                Amount After Taxes
                        </TableCell>
                            <TableCell align="right">${afterTaxAmount}</TableCell>
                        </TableRow>
                        <TableRow key={taxRate}>
                            <TableCell component="th" scope="row">
                                Tax Rate
                        </TableCell>
                            <TableCell align="right">{taxRate * 100}%</TableCell>
                        </TableRow>
                        <TableRow key={startDateDisplay}>
                            <TableCell component="th" scope="row">
                                Start Date
                        </TableCell>
                            <TableCell align="right">{startDateDisplay}</TableCell>
                        </TableRow>
                        <TableRow key={endDateDisplay}>
                            <TableCell component="th" scope="row">
                                End Date
                        </TableCell>
                            <TableCell align="right">{endDateDisplay}</TableCell>
                        </TableRow>
                    </TableBody>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>

    )
}

export default ToggleSalary