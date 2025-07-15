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

export default function MySchedulesWhenAuthLoaded({user}) {
    const dispatch = useDispatch();
    const {userId, username} = user;
    const placeholderWhileScheduleLoading = [{title: "No schedules found", goals: [], recordedTimeboxes: [], timeboxes: []}];
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

    if(status === 'loading') {data = placeholderWhileScheduleLoading;}
    if(status === 'error') {
        Sentry.captureException(error);
        return <Erroring></Erroring>
    }
    if(data.length == 0) return <Welcome></Welcome>

    return (<>
        <SignedInNav username={username} />
        <SchedulesView data={data}></SchedulesView>
        <Alert></Alert>
    </>)
}