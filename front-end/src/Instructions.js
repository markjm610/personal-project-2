import React, { useContext } from 'react'
import Context from './Context'
import { Typography } from '@material-ui/core'
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';


const Instructions = () => {

    const { selectedPlan } = useContext(Context)

    return (
        <>
            {!selectedPlan._id &&
                <div className='instructions-container'>

                    <Typography variant='h6' className='instruction'>
                        Making a plan:
                    </Typography>
                    <Typography className='instruction'>
                        1. Click the + in the middle of the top bar to add a new plan.
                    </Typography>
                    <Typography className='instruction'>
                        2. Once a plan is made, click the add salary and add expense buttons to add items to the plan.
                    </Typography>
                    <Typography variant='h6' className='instruction'>
                        Items:
                    </Typography>
                    <Typography className='instruction'>
                        1. Drag an item onto the graph to look at that item's graph data only. Click the graph to go back to normal.
                    </Typography>
                    <Typography className='instruction'>
                        2. Drag an item onto the trash can icon to delete the item.
                    </Typography>
                    <Typography className='instruction'>
                        3. Items can be toggled on and off by clicking the checkbox next to the name.
                    </Typography>
                    <Typography className='instruction'>
                        4. Click an item to expand its information.
                    </Typography>
                    <Typography className='instruction'>
                        5. Once an item is expanded, click the edit buttons to edit the item if you want.
                    </Typography>
                    <Typography className='instruction' style={{ marginTop: '10px' }}>
                        These instructions will go away when you make a plan, but you can click "Chart Your Cash" in the top left at any point to see them again.
                    </Typography>
                    <div className='links'>
                        <div>
                            <Typography style={{ color: 'white' }}>Developed by Mark Mansolino</Typography>
                        </div>
                        <div className='links-icons-container'>

                            <a href='https://github.com/markjm610'>
                                <GitHubIcon className='links-icon' />
                            </a>
                            <a href='https://www.linkedin.com/in/markmansolino/'>
                                <LinkedInIcon className='links-icon' />
                            </a>
                        </div>
                    </div>
                </div>
            }

        </>
    )
}

export default Instructions