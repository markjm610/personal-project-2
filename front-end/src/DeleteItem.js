import React, { useContext } from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import apiBaseUrl from './config';
import Context from './Context';
import Tooltip from '@material-ui/core/Tooltip';


const DeleteItem = () => {

    const { selectedPlan, setSelectedPlan } = useContext(Context)

    const handleDrop = async (item) => {

        if (item.salary) {
            const res = await fetch(`${apiBaseUrl}/plans/${selectedPlan._id}/salaries/${item.id}`, {
                method: 'DELETE',
                body: JSON.stringify({
                    displayed: item.displayed
                }),
                headers: {
                    "Content-Type": 'application/json',
                }
            })

            if (res.ok) {

                const { plan } = await res.json()

                const dateObjData = plan.graphData.map(datapoint => {
                    return { x: new Date(datapoint.x), y: datapoint.y }
                })

                plan.graphData = dateObjData


                setSelectedPlan(plan)
            }

        } else if (item.expense) {
            const res = await fetch(`${apiBaseUrl}/plans/${selectedPlan._id}/expenses/${item.id}`, {
                method: 'DELETE',
                body: JSON.stringify({
                    displayed: item.displayed
                }),
                headers: {
                    "Content-Type": 'application/json',
                }
            })


            if (res.ok) {

                const { plan } = await res.json()

                const dateObjData = plan.graphData.map(datapoint => {
                    return { x: new Date(datapoint.x), y: datapoint.y }
                })

                plan.graphData = dateObjData


                setSelectedPlan(plan)
            }



        }


    }

    const [{ isOver }, drop] = useDrop({
        accept: ItemTypes.ITEM,
        drop: (item) => {
            handleDrop(item);
        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    })


    return (
        <>
            {selectedPlan._id && <Tooltip arrow title='Drag an item here to delete it'>
                <div ref={drop}>
                    <DeleteIcon style={{ color: isOver ? 'red' : 'white' }} fontSize='large' />
                </div>
            </Tooltip>}
        </>
    )
}

export default DeleteItem