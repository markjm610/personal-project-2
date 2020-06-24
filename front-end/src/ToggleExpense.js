import React, { useState, useContext } from 'react'
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


const ToggleExpense = ({ id, amount, description, displayed, date, repeatingInterval }) => {
    const classes = useStyles();



    const [checked, setChecked] = useState(displayed)
    const { selectedPlan, setSelectedPlan } = useContext(Context)


    const dateDisplay = new Date(date[0], date[1], date[2]).toString().slice(3, 15)

    const handleToggle = async () => {

        const res = await fetch(`${apiBaseUrl}/plans/${selectedPlan._id}/expenses/${id}`, {
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


    const labelId = `checkbox-list-secondary-label-${description}`;

    return (
        // <ListItem key={description} button>
        //     <ListItemText id={labelId} primary={`${description}`} />
        //     <ListItemSecondaryAction>
        //         <Checkbox
        //             edge="end"
        //             onChange={handleToggle}
        //             checked={checked}
        //             inputProps={{ 'aria-labelledby': labelId }}
        //         />
        //     </ListItemSecondaryAction>
        // </ListItem>
        <div className={classes.root}>
            <ExpansionPanel>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.heading}>{description}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <TableBody>
                        <TableRow key={amount}>
                            <TableCell component="th" scope="row">
                                Amount
                        </TableCell>
                            <TableCell align="right">${amount}</TableCell>
                        </TableRow>
                        <TableRow key={dateDisplay}>
                            <TableCell component="th" scope="row">
                                Date
                        </TableCell>
                            <TableCell align="right">{dateDisplay}</TableCell>
                        </TableRow>
                        <TableRow key={repeatingInterval}>
                            <TableCell component="th" scope="row">
                                Repeats?
                        </TableCell>
                            <TableCell align="right">{repeatingInterval ? repeatingInterval : 'No'}</TableCell>
                        </TableRow>
                    </TableBody>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
    )
}

export default ToggleExpense