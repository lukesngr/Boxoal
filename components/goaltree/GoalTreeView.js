import { useSelector } from "react-redux";
import useGoalLimits from "@/hooks/useGoalLimits";
import { useScheduleSetter } from "@/hooks/useScheduleSetter";
import { useMemo } from "react";
import { IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import dayjs from "dayjs";
import '../../styles/goaltree.scss'
import { QueryClientProvider } from "react-query";
import { queryClient } from "@/modules/queryClient";
import CreateGoalForm from "../form/CreateGoalForm";
import { useState } from "react";
import { GoalTreeTimeboxes } from "./GoalTreeTimeboxes";
import useGoalStatistics from "@/hooks/useGoalStatistics";

export default function GoalTreeView(props) {
    const profile = useSelector(state => state.profile.value);
    const schedule = props.data[profile.scheduleIndex];
    const [createGoalState, setCreateGoalState] = useState({visible: false, id: profile.scheduleID, line: -1});
    const [goalTreeGoalView, setGoalTreeGoalView] = useState({open: false, goal: {}});
    useScheduleSetter(schedule);
    useGoalStatistics(schedule);
    useGoalLimits(schedule.goals);

    const {mapOfGoalsPutInLine, activeGoalsInLine} = useMemo(() => {
        const mapOfGoalsPutInLine = {};
        const activeGoalsInLine = new Array(25).fill(0);
        for(let i = 0; i < schedule.goals.length; i++) {
            let percentageCompleted = 0;
            if(schedule.goals[i].metric === null) {
                    let numberOfTimeboxes = 0;
                    let timeboxesHaveRecording = 0;
                    for(const timebox in schedule.goals[i].timeboxes) {
                        numberOfTimeboxes++;
                        if(timebox.recordedTimeBox != null) {
                            timeboxesHaveRecording++;
                        }
                    }

                    if(numberOfTimeboxes != 0) {
                        percentageCompleted = timeboxesHaveRecording / numberOfTimeboxes;
                    }else{
                        percentageCompleted = 0;
                    }
                    
            }else if(schedule.goals[i].loggingsOfMetric.length > 0){
                percentageCompleted = schedule.goals[i].loggingsOfMetric[schedule.goals[i].loggingsOfMetric.length - 1] / schedule.goals[i].metric;
            }

            if(schedule.goals[i].state == "active") {
                activeGoalsInLine[schedule.goals[i].partOfLine-1] = activeGoalsInLine[schedule.goals[i].partOfLine-1]+1;              
            }

            if (!Object.hasOwn(mapOfGoalsPutInLine, schedule.goals[i].partOfLine)) {
                mapOfGoalsPutInLine[schedule.goals[i].partOfLine] = [{percentageCompleted, ...schedule.goals[i]}]; 
            }else {
                mapOfGoalsPutInLine[schedule.goals[i].partOfLine].push({percentageCompleted, ...schedule.goals[i]});
            }
        }
        return {mapOfGoalsPutInLine, activeGoalsInLine}
    }, [schedule])

    
    return <>
        {goalTreeGoalView.open ? (<GoalTreeTimeboxes goal={goalTreeGoalView.goal} goBack={() =>setGoalTreeGoalView({open: false, goal: {}})}></GoalTreeTimeboxes>) : (<>
        <h1 className="viewHeading">Goal Tree</h1>
        <div className="container">
            <div className="row">
            {Object.keys(mapOfGoalsPutInLine).map((line) => (<>
                <div className="goalLine col">
                    {mapOfGoalsPutInLine[line].map((goal, index) => (<>
                    <div className="goalCard" onClick={() => setGoalTreeGoalView({open: true, goal})} style={goal.state == "waiting" ? {backgroundColor: '#403D3D'} : {}} key={index}>
                        <span className="goalCardTitle">{goal.title}</span>
                        <span className="goalCardUndertext">{dayjs(goal.targetDate).format('D MMM')}</span>
                        {goal.state == "completed" && <span style={{color: '#4FF38E'}} className="goalCardUndertext">Completed</span>}
                        {goal.state == "failed" && <span style={{color: '#FF0606'}} className="goalCardUndertext">Failed</span>}
                    </div>
                    <svg width={50} height={45} viewBox="0 0 24 30">
                        <path 
                            d="M12 0 L12 24 M5 17 L12 24 L19 17" 
                            stroke="#875F9A" 
                            strokeWidth={2}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    </>))}
                    <IconButton style={{color: 'white', backgroundColor: 'black', borderRadius: '0px'}} className='addGoalToLineButton'
                    onClick={() => setCreateGoalState({visible: true, id: profile.scheduleID, line: line})}>
                        <AddIcon></AddIcon>
                    </IconButton>
                    
                </div>
                </>
            ))}
        </div>
        </div>
        <QueryClientProvider client={queryClient}>
            <CreateGoalForm 
                visible={createGoalState.visible} 
                active={!(activeGoalsInLine[createGoalState.line-1] > 0)} 
                line={Number(createGoalState.line)} 
                close={() => setCreateGoalState({visible: false, id: profile.scheduleID, line: -1})} 
                id={createGoalState.id}  
                goals={schedule.goals}
            />
        </QueryClientProvider>
    </>)}</>
}
