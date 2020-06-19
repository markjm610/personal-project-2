import React, { useState, useEffect, useContext } from 'react';
import Context from './Context';

const InfoDisplay = () => {

    const { hoverData } = useContext(Context)
    // `${hoverData[0].x}`

    return (
        <>
            {hoverData[0] && <h1 className='info'>{hoverData[0].x.toString().slice(0, 15)}</h1>}
        </>
    )
}

export default InfoDisplay