import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useAuth0 } from "./react-auth0-spa";
import { XYPlot, LineSeries, XAxis, YAxis, Highlight, Crosshair, AreaSeries } from 'react-vis';


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: 'rgb(110, 211, 43)',
        color: 'white'
    },
}));

const LandingPage = ({ history }) => {
    const classes = useStyles();

    const { isAuthenticated, loginWithRedirect } = useAuth0();
    // const [landingPageData, setLandingPageData] = useState([])

    useEffect(() => {
        if (isAuthenticated) {
            history.push('/main')
        }
    }, [isAuthenticated])


    const landingPageData = []

    for (let j = 0; j < 12; j++) {
        landingPageData.push({ x: new Date(2020, j), y: j * 1100000 / 12 })
    }





    return (
        <div className='landing-page'>
            <Typography style={{ color: 'white', display: 'flex', justifyContent: 'center' }} variant='h2'>Chart Your Cash</Typography>

            <div className='landing-page-graph-container'>
                <XYPlot
                    // dontCheckIfEmpty

                    margin={{ left: 70 }}
                    height={650}
                    width={1000}
                    xType='time'
                    animation
                >
                    <XAxis
                        animation
                        style={{
                            userSelect: 'none'
                        }}
                        tickLabelAngle={15}
                        tickPadding={20}
                    />
                    <YAxis
                        animation
                        style={{
                            userSelect: 'none'
                        }}
                    />
                    <LineSeries
                        data={landingPageData}
                        // onNearestX={handleNearestX}
                        color='rgb(110, 211, 43)'
                    />
                    {/* {crosshair.length !== 0 && <Crosshair
                        values={crosshair}
                    >
                        <div className='crosshair'>
                            <div>{crosshair[0].x.toString().slice(0, 15)}</div>
                            <div>${crosshair[0].y.toFixed(2)}</div>
                        </div>
                    </Crosshair>} */}
                </XYPlot>
            </div>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                {/* <div className={classes.paper}> */}

                {!isAuthenticated && <Button
                    type="submit"
                    fullWidth
                    variant="contained"

                    className={classes.submit}
                    onClick={() => loginWithRedirect({})}
                >
                    Log In or Sign Up
                    </Button>}
                {/* </div> */}

            </Container >
        </div>
    );
}

export default LandingPage