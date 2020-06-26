import React, { useContext } from 'react'
import AddSalaryNav from './AddSalaryNav'
import AddExpenseNav from './AddExpenseNav'
import Context from './Context'
import Button from '@material-ui/core/Button';

const BelowGraph = () => {

    const { setLastDrawLocation, selectedPlan } = useContext(Context)

    const zoomOut = () => {
        setLastDrawLocation(null)
    }


    return (
        <>
            {selectedPlan._id && <div className='below-graph'>
                <AddSalaryNav />
                <AddExpenseNav />
                <div className='zoom-out-button'>
                    <Button variant='outlined' onClick={zoomOut}>Zoom Out</Button>
                </div>
            </div>}
        </>

    )
}

export default BelowGraph