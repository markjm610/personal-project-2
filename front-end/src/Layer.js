import React, { useContext } from 'react'
import Context from './Context'
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';
import InfoDisplay from './InfoDisplay';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));


const Layer = () => {
    const classes = useStyles();

    const { disableLayer, showLayer, setShowLayer } = useContext(Context)

    const handleToggle = () => {
        setShowLayer(false)
    }

    return (
        <>
            {
                !disableLayer && showLayer &&
                <Backdrop
                    className={classes.backdrop}
                    open={showLayer}
                    onClick={handleToggle}
                >

                    <InfoDisplay />

                </Backdrop>
            }
        </>
    )
}

export default Layer
