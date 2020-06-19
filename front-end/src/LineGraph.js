import React, { useState, useEffect, useContext } from 'react';
import { createContainer, VictoryArea, VictoryChart, VictoryLine, VictoryZoomContainer, VictoryCursorContainer, VictoryVoronoiContainer } from 'victory';
import apiBaseUrl from './config';
import Context from './Context';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';
import InfoDisplay from './InfoDisplay';
// import CircularProgress from '@material-ui/core/CircularProgress';
const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const VictoryZoomVoronoiContainer = createContainer("zoom", "voronoi");

const LineGraph = () => {

    const { setHoverData, selectedPlan, displayedData, setDisplayedData, displayedPlan, currentPlan } = useContext(Context)

    const [zoomDomain, setZoomDomain] = useState()
    // const [graphData, setGraphData] = useState([])



    // useEffect(() => {
    //     const fetchData = async () => {


    //         // console.log(salaries)

    //             // (End year - start year) * 12 + (end month - start month)
    //             // const numberOfMonths = (salary.endDate[0] - salary.startDate[0]) * 12 + (salary.endDate[1] - salary.startDate[1])


    //     }


    // }, [])


    const parseDate = (date) => {
        return date.toString().slice(0, 15)
    }

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleToggle = () => {
        setOpen(!open);
    };

    return (
        <div className='chart-wrapper'>
            <VictoryChart width={1000} height={470} scale={{ x: "time" }}
                events={[
                    {
                        target: "data",
                        childName: 'Area',
                        eventHandlers: {
                            onClick: () => {
                                handleToggle()
                            }
                        }
                    }
                ]}
                containerComponent={
                    <VictoryZoomVoronoiContainer
                        name='Voronoi'
                        labels={({ datum }) => `${parseDate(datum.x)}`}
                        zoomDimension="x"
                        zoomDomain={zoomDomain}
                        voronoiDimension='x'
                        onActivated={(datum) => setHoverData(datum)}

                    // onClick={points => setHoverData(points)}
                    />

                }
            >

                {/* <VictoryLine
                    name="Line"
                    style={{
                        data: { stroke: "tomato" }
                    }}
                    data={selectedPlan.graphData}
                // x="a"
                // y="b"
                /> */}
                <VictoryArea
                    name='Area'
                    style={{
                        data: { fill: "lightgreen", stroke: 'green', strokeWidth: 3 }
                    }}
                    data={selectedPlan.graphData}

                // x="a"
                // y="b"
                />


            </VictoryChart>
            {open && <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
                <InfoDisplay />
                {/* <CircularProgress color="inherit" /> */}
            </Backdrop>}
        </div >
    );

}

export default LineGraph;
