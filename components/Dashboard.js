import SignedInNav from "./nav/SignedInNav";
import { useDispatch } from "react-redux";
import { useProfile } from "../hooks/useProfile";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Loading from "./base/Loading";
import axios from "axios";
import '../styles/dashboard.scss';
import Statistics from "./Statistics";
import { GoalLineGraph } from "./dashboards/GoalLineGraph";
import useGoalStatistics from "@/hooks/useGoalStatistics";
import Welcome from "./base/Welcome";

export default function Dashboard({user}) {

    const dispatch = useDispatch();
    const {scheduleIndex} = useSelector(state => state.profile.value);
    const {userId, username} = user;
    let dataForSchedule = {timeboxes: [], recordedTimeboxes: []};
    useProfile(userId, dispatch);

    const {status, data, error} = useQuery({
        queryKey: ["schedule"], 
        queryFn: async () => {
            const response = await axios.get("/api/getSchedules", { params: {
                userUUID: userId
            }});
            return response.data;
        },
        enabled: true
    })

    useGoalStatistics(data?.length > 0 ? data[scheduleIndex] : null);

    if(status === 'loading' || status === 'pending') return <Loading />
    if(status === 'error') return <p>Error: {error.message}</p>
    if(status === 'success' && data.length == 0) return <Welcome></Welcome>
    if(data.length != 0) {
        dataForSchedule = data[scheduleIndex];
    }

    return (<>
        <SignedInNav username={username}></SignedInNav>
        <div style={{height: '100%', paddingLeft: '20%', paddingTop: '10%', paddingRight: '20%'}}>
            <h1 className="welcomeTitle">Welcome Back</h1>
            {dataForSchedule.goals.map((goal, index) => (
                <GoalLineGraph key={index} goalData={goal} />
            ))}
            <Statistics recordedTimeboxes={dataForSchedule.recordedTimeboxes} timeboxes={dataForSchedule.timeboxes}></Statistics>
        </div>
        </>)
}
