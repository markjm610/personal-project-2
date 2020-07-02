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
import apiBaseUrl from './config';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';


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
    }
}));

const TopBar = () => {
    const classes = useStyles();
    const theme = useTheme();

    const { setLastDrawLocation, currentUserPlans, setCurrentUserPlans, currentUser, expandItem, setExpandItem } = useContext(Context)
    const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

    const [drawerOpen, setDrawerOpen] = useState(false);


    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);


    const [savedItems, setSavedItems] = useState({})

    // useEffect(() => {
    //     if (currentUser) {
    //         // let salaries;
    //         // let expenses;
    //         let itemsObj = {}
    //         const getItems = async (planId) => {
    //             const res = await fetch(`${apiBaseUrl}/plans/${planId}/items`)
    //             const items = await res.json()
    //             const salaries = [...items.salaries]
    //             const expenses = [...items.expenses]
    //             salaries.forEach(salary => {
    //                 itemsObj[salary._id] = false
    //             })
    //             expenses.forEach(expense => {
    //                 itemsObj[expense._id] = false
    //             })

    //             setExpandItem(itemsObj)
    //             // setSavedItems({ salaries: salaries, expenses: expenses })

    //             // savedItems.salaries = salaries
    //             // savedItems.expenses = expenses
    //             // console.log(items)
    //             // expenses.forEach(expense => {
    //             //     setExpandItem({ ...expandItem, [expense._id]: false })
    //             // })
    //         }

    //         const getPlans = async () => {
    //             const res = await fetch(`${apiBaseUrl}/users/${currentUser._id}/plans`)

    //             const plans = await res.json()


    //             plans.forEach(async (plan) => {
    //                 await getItems(plan._id)
    //                 // plan.salaries = salaries
    //                 // plan.expenses = expenses

    //             })

    //             setCurrentUserPlans(plans)
    //         }
    //         getPlans()


    //     }

    // }, [currentUser])






    return (
        <div className={classes.root}>
            <AppBar position="static" className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
            })}>
                <Toolbar className={classes.toolbar}>
                    <div className='app-bar-div'>
                        <div>
                            <Typography variant="h6" className={classes.title}>
                                Chart Your Cash
                    </Typography>
                        </div>
                        <div className='plan-nav'>
                            {currentUserPlans.map(plan => {
                                return <PlanNav key={plan._id} id={plan._id} name={plan.name} />
                            })}

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