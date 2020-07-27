import React, { useState, useContext, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import AddSalaryNav from './AddSalaryNav';
import AddExpenseNav from './AddExpenseNav';
import Context from './Context'
import { useAuth0 } from "./react-auth0-spa";
import { Link } from "react-router-dom";
import NewPlanNav from './NewPlanNav';
import PlanNav from './PlanNav';
import clsx from 'clsx';
import { Tabs } from '@material-ui/core';


const drawerWidth = 'auto';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        '&:hover': {
            cursor: 'pointer'
        }
    },
    fullList: {
        width: 'auto',
    },
    appBar: {
        backgroundColor: 'rgb(49, 48, 48)',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'center'
    },
    indicator: {
        backgroundColor: 'white'
    }
}));

const TopBar = () => {
    const classes = useStyles();
    const theme = useTheme();

    const { setSelectedPlan, setLastDrawLocation, currentUserPlans, setCurrentUserPlans, currentUser, expandItem, setExpandItem } = useContext(Context)
    const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0)

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);


    const [savedItems, setSavedItems] = useState({})

    const clickTitle = () => {
        setSelectedPlan({})
        setSelectedTab(null)
    }

    return (
        <div className={classes.root}>
            <AppBar position="static" className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
            })}>
                <Toolbar className={classes.toolbar}>
                    <div className='app-bar-div'>
                        <div>
                            <Typography variant="h6" className={classes.title} onClick={clickTitle}>
                                Chart Your Cash
                    </Typography>
                        </div>
                        <div className='plan-nav'>
                            <Tabs
                                variant='scrollable'
                                value={selectedTab}
                                classes={{
                                    indicator: classes.indicator
                                }}
                            >
                                {currentUserPlans.map((plan, i) => {
                                    return (
                                        <PlanNav
                                            key={plan._id}
                                            id={plan._id}
                                            name={plan.name}
                                            setSelectedTab={setSelectedTab}
                                            i={i}
                                        />
                                    )
                                })}
                            </Tabs>
                            <div className='new-plan-nav'><NewPlanNav /></div>
                        </div>

                        {/* <div>
                            <Button color="inherit" onClick={zoomOut}>Zoom Out</Button>
                        </div> */}
                        <div>
                            {!isAuthenticated && (
                                <Button color='inherit' onClick={() => loginWithRedirect({})}>Log in</Button>
                            )}

                            {isAuthenticated && <Button color='inherit' onClick={() => logout()}>Log out</Button>}
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        </div >
    );
}

export default TopBar