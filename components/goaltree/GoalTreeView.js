import { useSelector } from "react-redux";
import useGoalLimits from "@/hooks/useGoalLimits";
import { useScheduleSetter } from "@/hooks/useScheduleSetter";
import { useMemo } from "react";
import { Grid, Card } from "@mui/material";
import dayjs from "dayjs";
export default function GoalTreeView(props) {
    const profile = useSelector(state => state.profile.value);
    const schedule = props.data[profile.scheduleIndex]; 
    useScheduleSetter(schedule);
    useGoalLimits(schedule.goals);
    

    const mapOfGoalsPutInLine = useMemo(() => {
        let mapOfGoalsPutInLine = {};
        for(let i = 0; i < schedule.goals.length; i++) {
            let percentageCompleted = 0;
            if(schedule.goals[i].metric === null) {
                    let numberOfTimeboxes = 0;
                    let timeboxesHaveRecording = 0;
                    for(timebox in schedule[i].goals.timeboxes) {
                        numberOfTimeboxes++;
                        if(timebox.recordedTimeBoxes !== null && timebox.recordedTimeBoxes.length != 0) {
                            timeboxesHaveRecording++;
                        }
                    }
                    percentageCompleted = timeboxesHaveRecording / numberOfTimeboxes;
            }else if(schedule.goals[i].loggingsOfMetric.length > 0){
                percentageCompleted = schedule.goals[i].loggingsOfMetric[schedule.goals[i].loggingsOfMetric.length - 1] / schedule.goals[i].metric;
            }
            if (!Object.hasOwn(mapOfGoalsPutInLine, schedule.goals[i].partOfLine)) {
                
                mapOfGoalsPutInLine[schedule.goals[i].partOfLine] = [{percentageCompleted, ...schedule.goals[i]}]; 
            }else {
                mapOfGoalsPutInLine[schedule.goals[i].partOfLine].push({percentageCompleted, ...schedule.goals[i]});
            }
        }
        return mapOfGoalsPutInLine
    }, [schedule])

    
    return <>
        <h1 className="viewHeading">Goal Tree</h1>
        {Object.keys(mapOfGoalsPutInLine).map((keyBy) => (
            <Grid direction="row">{mapOfGoalsPutInLine[keyBy].map((goal, index) => (
                <Card key={index}>
                    <span>{goal.title}</span>
                    <span>{dayjs(goal.targetDate).format('D MMM')}</span>
                    {goal.state == "completed" && <span>Completed</span>}
                    {goal.state == "failed" && <span>Failed</span>}
                    <span>{goal.percentageCompleted}</span>
                </Card>
            ))}</Grid>
        ))}
    </>
}