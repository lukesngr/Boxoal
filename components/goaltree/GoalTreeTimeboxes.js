import dayjs from "dayjs";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Button } from "@mui/material";
import { getAverageTimeOverAndOffBy } from "@/modules/boxCalculations";
import { useMediaQuery } from 'react-responsive';
import { useEffect, useState } from "react";

export function GoalTreeTimeboxes(props) {
    const {goal} = props;
    const [widthOfConnector, setWidthOfConnector] = useState(150);
    const smallerThanLargeBreakpoint = useMediaQuery({query: '(max-width: 1222px)'});
    const smallerThanMediumBreakpoint = useMediaQuery({query: '(max-width: 1022px)'});

    useEffect(() => {
        if(smallerThanLargeBreakpoint) {
            if(smallerThanMediumBreakpoint) {
                setWidthOfConnector(10);
            }else{
                setWidthOfConnector(50);
            }
            
        }else{
            setWidthOfConnector(150);
        }
    }, [smallerThanLargeBreakpoint, smallerThanMediumBreakpoint])
    return <>
    <Button className="goBackButtonGoalTree" sx={{
        backgroundColor: 'black',
        color: 'white',
        fontFamily: 'Koulen',
        fontSize: 20,
        borderRadius: 0,
        '&:hover': {
            backgroundColor: 'black',
            color: 'white'
        }}
    } onClick={()=> props.goBack()}>
        Go Back
    </Button>
    <div className="goalTreeTimeboxesContainer">
        <div className="twoComponentsInLine">
            <div className="goalTimeboxesCard" style={goal.state == "waiting" ? {backgroundColor: '#403D3D'} : {}}>
                <span className="goalCardTitle">{goal.title}</span>
                <span className="goalCardUndertext">{dayjs(goal.targetDate).format('D MMM')}</span>
                {goal.state == "completed" && <span style={{color: '#4FF38E'}} className="goalCardUndertext">Completed</span>}
                {goal.state == "failed" && <span style={{color: '#FF0606'}} className="goalCardUndertext">Failed</span>}
            </div>
            <div className="diagramArrows">
                <svg className="pipe" viewBox={`0 0 ${widthOfConnector} 100`}>
                    <line x1={0} y1={50} x2={widthOfConnector-5} y2={50} style={{stroke:  "#875F9A", strokeWidth: 5}}></line>
                    <line x1={widthOfConnector-5} y1={50} x2={widthOfConnector-5} y2={100} style={{stroke:  "#875F9A", strokeWidth: 5}}></line>
                </svg>
                {goal.timeboxes.map((timebox, index) => (
                <svg className="timeboxToPipe" key={index} viewBox={`0 0 ${widthOfConnector} 50`}>
                    <line x1={widthOfConnector-5} y1={0} x2={widthOfConnector-5} y2={50} style={{stroke:  "#875F9A", strokeWidth: 5}}></line>
                    <line x1={widthOfConnector-8} y1={48} x2={250} y2={48} style={{stroke:  "#875F9A", strokeWidth: 5}}></line>
                </svg>
                ))}
            </div>
            <div>
            {goal.timeboxes.map((timebox, index) => {
                const isFailed = dayjs().isAfter(dayjs(timebox.endTime)) && timebox.recordedTimeBox == null;
                const isCompleted = timebox.recordedTimeBox != null;
                let minutesOverBy = 0;
                let timeStartedAccuracyForTimebox = 0;
                if(isCompleted) {
                    ({minutesOverBy, timeStartedAccuracyForTimebox} = getAverageTimeOverAndOffBy(timebox));
                }
                return (
                <div key={index} className="goalTimeboxCard">
                    <span className="goalTimeboxTitle"><AccessTimeIcon></AccessTimeIcon>{timebox.title} - {dayjs(timebox.startTime).format('hh:mm DD/MM')}</span>
                    <div>
                    {isFailed && <span className="goalTimeboxFailed">Failed</span>}
                    {isCompleted && <span className="goalTimeboxCompleted">Completed</span>}
                    {isCompleted && <span className="goalTimeboxCompleted">{timeStartedAccuracyForTimebox > 0 ? (timeStartedAccuracyForTimebox.toFixed(2) +" min late") : ((-timeStartedAccuracyForTimebox).toFixed(2) +" min early")}</span>}
                    {isCompleted && <span className="goalTimeboxCompleted">{minutesOverBy > 0 ? (minutesOverBy.toFixed(2) +" min longer") : ((-minutesOverBy).toFixed(2) +" min earlier")}</span>}
                    </div>
                </div>
                )
            })}
            </div>
        </div>
    </div>
    </>
}
