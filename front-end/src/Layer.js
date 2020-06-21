import React, { useContext } from 'react'
import Context from './Context'
import AddOrView from './AddOrView'
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));


const Layer = () => {
    const classes = useStyles();

    const { disableLayer, showLayer } = useContext(Context)

    return (
        <>
            {
                !disableLayer && showLayer && <Backdrop className={classes.backdrop} open={showLayer} >

                    <AddOrView />

                </Backdrop>
            }
        </>
    )
}

export default Layer
