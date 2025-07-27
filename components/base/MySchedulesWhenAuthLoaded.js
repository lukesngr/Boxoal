import { useProfile } from "@/hooks/useProfile";
import { useDispatch } from "react-redux";
import Alert from "@/components/base/Alert";
import { useQuery } from "@tanstack/react-query";
import SchedulesView from "@/components/schedule/SchedulesView";
import axios from "axios";
import Welcome from "./Welcome";
import SignedInNav from "../nav/SignedInNav";
import Erroring from "./Erroring";
import * as Sentry from '@sentry/nextjs';
import Loading from "../base/Loading";

export default function MySchedulesWhenAuthLoaded({user}) {
    const dispatch = useDispatch();
    const {userId, username} = user;
    useProfile(userId, dispatch);
    let dataForSchedule = [{title: "No schedules found", goals: [], recordedTimeboxes: [], timeboxes: []}];

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

    if(status === 'pending' || status === 'loading') { return <Loading />; }
    if(status === 'error') {
        Sentry.captureException(error);
        return <Erroring></Erroring>
    }
    if(status === 'success' && data.length == 0) return <Welcome></Welcome>

    dataForSchedule = data;
    console.log(data);

    return (<>
        <SignedInNav username={username} />
        <SchedulesView data={dataForSchedule}></SchedulesView>
        <Alert></Alert>
    </>)
}