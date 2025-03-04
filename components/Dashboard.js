import SignedInNav from "./nav/SignedInNav";
import { useDispatch } from "react-redux";
import { useProfile } from "../hooks/useProfile";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Loading from "./base/Loading";
import serverIP from "@/modules/serverIP";
import axios from "axios";
import { getProgressWithGoal } from "@/modules/coreLogic";

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

    return (<>
        <SignedInNav username={username}></SignedInNav>
        <div style={{backgroundColor: '#D9D9D9', height: '100%', paddingLeft: '20%', paddingTop: '10%', paddingRight: '20%'}}>
            <h1 style={{fontFamily: 'KameronRegular', fontSize: 30, color: 'black', textAlign: 'center', marginTop: 30}}>Welcome Back</h1>
            <h1 style={{fontFamily: 'KameronRegular', fontSize: 20, color: 'black', marginTop: 20, marginLeft: 30}}>Lvl {goalsCompleted}</h1>
        </div>
        </>)
}