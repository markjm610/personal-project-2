import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
        backgroundColor: 'rgb(49, 48, 48)'
    }
}));

const TopBar = () => {
    const classes = useStyles();

    const { setLastDrawLocation } = useContext(Context)
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const zoomOut = () => {
        setLastDrawLocation(null)
    }


    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon onClick={handleMenu} />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={open}
                        onClose={handleClose}
                    >
                        <div onClick={handleClose}>
                            <AddSalaryNav />
                        </div>
                        <div onClick={handleClose}>
                            <AddExpenseNav />
                        </div>
                    </Menu>
                    <Typography variant="h6" className={classes.title}>
                        Top Bar
                    </Typography>
                    <Button color="inherit" onClick={zoomOut}>Zoom Out</Button>
                    <div>
                        {!isAuthenticated && (
                            <Button color='inherit' onClick={() => loginWithRedirect({})}>Log in</Button>
                        )}

                        {isAuthenticated && <Button color='inherit' onClick={() => logout()}>Log out</Button>}
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default TopBar