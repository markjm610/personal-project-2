import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
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

    useEffect(() => {
        if (isAuthenticated) {
            history.push('/main')
        }
    }, [isAuthenticated])


    const landingPageData = []

    for (let i = 0; i < 12; i++) {
        landingPageData.push({ x: new Date(2020, i), y: i * 1100000 / 12 })
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
                            userSelect: 'none',
                            text: {
                                fill: 'white'
                            }
                        }}
                        tickLabelAngle={15}
                        tickPadding={20}
                    />
                    <YAxis
                        animation
                        style={{
                            userSelect: 'none',
                            text: {
                                fill: 'white'
                            }
                        }}
                    />
                    <LineSeries
                        data={landingPageData}
                        // onNearestX={handleNearestX}
                        color='rgb(110, 211, 43)'
                    />
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
                    Continue
                    </Button>}
                {/* </div> */}

            </Container >
        </div>
    );
}

export default LandingPage