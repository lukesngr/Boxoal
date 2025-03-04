import SignedInNav from "./nav/SignedInNav";
import { useDispatch } from "react-redux";
import { useProfile } from "../hooks/useProfile";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Loading from "./base/Loading";
import serverIP from "@/modules/serverIP";
import axios from "axios";
import { getProgressWithGoal } from "@/modules/coreLogic";
import '../styles/dashboard.scss';
import { Card, LinearProgress, Paper } from "@mui/material";
import { getStatistics } from "@/modules/boxCalculations";

export default function Dashboard({user}) {

    const dispatch = useDispatch();
    const {scheduleIndex} = useSelector(state => state.profile.value);
    let {userId, username} = user;
    let recordedTimeboxes = [];
    let averageProgress = 0;
    let goalsCompleted = 0;
    useProfile(userId, dispatch);

    const {status, data, error, refetch} = useQuery({
        queryKey: ["scheduleForDash"], 
        queryFn: async () => {
            const response = await axios.get(serverIP+"/getSchedules", { params: {
                userUUID: userId
            }});
            return response.data;
        },
        enabled: true
    })

    if(status === 'loading') return <Loading />
    if(status === 'error') return <p>Error: {error.message}</p>

    if(data.length != 0) {
        let dataForSchedule = data[scheduleIndex]
        goalsCompleted = dataForSchedule.goals.reduce((count, item) => item.completed ? count + 1 : count, 0);
        
        for(let goal of dataForSchedule.goals) {
            if(!goal.completed) {
            averageProgress += getProgressWithGoal(goal.timeboxes);
            }
        }
        if(dataForSchedule.goals.length != 0) { averageProgress = averageProgress / dataForSchedule.goals.length; }
        recordedTimeboxes = dataForSchedule.recordedTimeboxes;
    }

    let {averageTimeOverBy, averageTimeStartedOffBy, percentagePredictedStart, percentageCorrectTime, percentageRescheduled} = getStatistics(recordedTimeboxes);

    return (<>
        <SignedInNav username={username}></SignedInNav>
        <div style={{height: '100%', paddingLeft: '20%', paddingTop: '10%', paddingRight: '20%'}}>
            <h1 className="welcomeTitle">Welcome Back</h1>
            <h1 className="levelTitle">Lvl {goalsCompleted}</h1>
            <LinearProgress variant="determinate" value={averageProgress} />
            <div class="container">
            <div class="row">
                <div class="col">
                 <Paper sx={{backgroundColor: '#C5C27C', marginTop: 2 }} className="statPaper" elevation={4}>
                     <p>Average Time Over By</p>
                     <h1>{averageTimeOverBy}</h1>
                </Paper>
                </div>
                <div class="col">
                One of three columns
                </div>
            </div>
            </div>
        </div>
        </>)
}