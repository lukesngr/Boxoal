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
import { PieChart } from "@mui/x-charts";
import { useMemo } from "react";

export default function Dashboard({user}) {

    const dispatch = useDispatch();
    const {scheduleIndex} = useSelector(state => state.profile.value);
    let {userId, username} = user;
    let recordedTimeboxes = [];
    let averageProgress = 0;
    let goalsCompleted = 0;
    let hoursLeftInDay = 24;
    useProfile(userId, dispatch);

    const {status, data, error, refetch} = useQuery({
        queryKey: ["schedule"], 
        queryFn: async () => {
            const response = await axios.get("/api/getSchedules", { params: {
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
        goalsCompleted = dataForSchedule.goals.reduce((count, item) => item.completed ? count + 1 : count, 0); //no tradeoff for making this faster
        
        for(let goal of dataForSchedule.goals) {
            if(!goal.completed) {
            averageProgress += getProgressWithGoal(goal.timeboxes);
            }
        }
        if(dataForSchedule.goals.length != 0) { averageProgress = averageProgress / dataForSchedule.goals.length; }
        recordedTimeboxes = dataForSchedule.recordedTimeboxes;

        
        for(let timebox of dataForSchedule.timeboxes) {
            let isSameDate = (new Date(timebox.startTime).getDate() == new Date().getDate()) && (new Date(timebox.startTime).getMonth() == new Date().getMonth()) && (new Date(timebox.startTime).getFullYear() == new Date().getFullYear());
            let isReoccuringDaily = timebox.reoccuring != null && timebox.reoccuring.reoccurFrequency === "daily";
            let isReoccuringWeeklyAndToday = timebox.reoccuring != null && timebox.reoccuring.reoccurFrequency === "weekly" && timebox.reoccuring.weeklyDay == new Date().getDay();
            let isReoccuringDailyOrWeeklyAndToday = isReoccuringDaily || isReoccuringWeeklyAndToday;
            if(timebox.isTimeblock && (isSameDate || isReoccuringDailyOrWeeklyAndToday)) {
                let hoursConversionDivider = 3600000;
                hoursLeftInDay -= ((new Date(timebox.endTime) - new Date(timebox.startTime)) / hoursConversionDivider);
            }   
        }
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
                    <Paper sx={{backgroundColor: '#875F9A', marginTop: 2 }} className="statPaper" elevation={4}>
                        <p>{averageTimeOverBy > 0 ? "Time On Average Recordings Are Over By" : "Time On Average Recordings Are Under By"}</p>
                        <h1>{averageTimeOverBy > 0 ? averageTimeOverBy.toFixed(2) : -averageTimeOverBy.toFixed(2)}min</h1>
                    </Paper>
                    </div>
                    <div class="col">
                    <Paper sx={{backgroundColor: '#875F9A', marginTop: 2 }} className="statPaper" elevation={4}>
                        <p>{averageTimeStartedOffBy > 0 ? "Time Average Recordings Are Late By" : "Time On Average Recordings Are Early By"}</p>
                        <h1>{averageTimeStartedOffBy > 0 ? averageTimeStartedOffBy.toFixed(2) : -averageTimeStartedOffBy.toFixed(2)}min</h1>
                    </Paper>
                    </div>
                    <div class="col">
                    <Paper sx={{backgroundColor: '#875F9A', marginTop: 2 }} className="statPaper" elevation={4}>
                        <p>Hours Available In Day</p>
                        <h1>{hoursLeftInDay}hr</h1>
                    </Paper>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <Paper sx={{backgroundColor: '#875F9A', marginTop: 2, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} elevation={4}>
                            <PieChart
                                colors={['black', '#4fd1cf']}
                                margin={{ top: 0, bottom: 25, left: 10, right: 10 }}
                                series={[
                                    {
                                    data: [
                                        { id: 0, value: percentagePredictedStart*100, label: 'Predicted Start' },
                                        { id: 1, value: (1-percentagePredictedStart)*100, label: 'Not Predicted Start' },
                                    ],
                                    },
                                ]}
                                width={250}
                                height={500}
                                slotProps={{
                                    legend: {
                                    direction: 'row',
                                    position: { vertical: 'bottom', horizontal: 'middle' },
                                    
                                    }
                                }}
                                />
                        </Paper>
                    </div>
                    <div class="col">
                        <Paper sx={{backgroundColor: '#875F9A', marginTop: 2, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} elevation={4}>
                            <PieChart
                                colors={['black', '#4fd1cf']}
                                margin={{ top: 0, bottom: 25, left: 10, right: 10 }}
                                series={[
                                    {
                                    data: [
                                        { id: 0, value: percentageCorrectTime*100, label: 'Predicted Time' },
                                        { id: 1, value: (1-percentageCorrectTime)*100, label: 'Not Predicted Time' },
                                    ],
                                    },
                                ]}
                                width={250}
                                height={500}
                                slotProps={{
                                    legend: {
                                    direction: 'row',
                                    position: { vertical: 'bottom', horizontal: 'middle' },
                                    
                                    }
                                }}
                                />
                        </Paper>
                    </div>
                    <div class="col">
                        <Paper sx={{backgroundColor: '#875F9A', marginTop: 2, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'  }} elevation={4}>
                            <PieChart
                                margin={{ top: 0, bottom: 25, left: 10, right: 10 }}
                                colors={['black', '#4fd1cf']}
                                series={[
                                    {
                                    data: [
                                        { id: 0, value: percentageRescheduled*100, label: 'Rescheduled' },
                                        { id: 1, value: (1-percentageRescheduled)*100, label: 'Not Rescheduled' },
                                    ],
                                    },
                                ]}
                                width={250}
                                height={500}
                                slotProps={{
                                    legend: {
                                    direction: 'row',
                                    position: { vertical: 'bottom', horizontal: 'middle' },
                                    
                                    }
                                }}
                                />
                        </Paper>
                    </div>
                </div>
            </div>
        </div>
        </>)
}