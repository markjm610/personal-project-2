import React, { useContext } from 'react'
import Context from './Context'
import { Typography } from '@material-ui/core'


const Instructions = () => {

    const { selectedPlan } = useContext(Context)

    return (
        <>
            {!selectedPlan._id &&
                <>
                    <Typography variant='h4' style={{ color: 'white' }}>
                        Instructions
                    </Typography>
                    <Typography variant='h6' style={{ color: 'white' }}>
                        Click the + in the middle of the top bar to add a new plan.
                    </Typography>
                    <Typography variant='h6' style={{ color: 'white' }}>
                        Once a plan is made, click the add salary and add expense buttons to add items to the plan.
                    </Typography>
                    <Typography variant='h6' style={{ color: 'white' }}>
                        Items can be dragged onto the graph to look at that item's graph data only. Click the graph to go back to normal.
                    </Typography>
                    <Typography variant='h6' style={{ color: 'white' }}>
                        Drag an item onto the trash can icon to delete the item.
                    </Typography>
                    <Typography variant='h6' style={{ color: 'white' }}>
                        Items can be toggled on and off by clicking the checkbox next to the name.
                    </Typography>
                    <Typography variant='h6' style={{ color: 'white' }}>
                        Click an item to expand its information.
                    </Typography>

                </>
            }

        </>
    )
}

export default Instructions