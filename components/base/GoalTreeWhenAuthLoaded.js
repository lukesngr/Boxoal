import { useProfile } from "@/hooks/useProfile";
import { useDispatch } from "react-redux";
import Alert from "@/components/base/Alert";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Welcome from "./Welcome";
import SignedInNav from "../nav/SignedInNav";
import Erroring from "./Erroring";
import * as Sentry from '@sentry/nextjs';
import Loading from "./Loading";
import GoalTreeView from "../goaltree/GoalTreeView";
import { fetchAuthSession } from "@aws-amplify/auth";

export default function GoalTreeWhenAuthLoaded({user}) {
    const dispatch = useDispatch();
    const {userId, username} = user;
    useProfile(userId, dispatch);
    let dataForSchedule = [{title: "No schedules found", goals: []}];

    const {status, data, error} = useQuery({
        queryKey: ["schedule"], 
        queryFn: async () => {
            const session = await fetchAuthSession();
            const accessToken = session.tokens?.accessToken.toString();
            const response = await axios.get("/api/getSchedules",  {
	      headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }});
            return response.data;

        },
        enabled: true
    })

    if(status === 'pending' || status === 'loading') { return <Loading />; }
    if(status === 'error') { Sentry.captureException(error); return <Erroring></Erroring>; }
    if(status === 'success' && data.length == 0) { return <Welcome></Welcome> }

    dataForSchedule = data;

    return (
    <>
      <SignedInNav username={username} />
      <GoalTreeView data={dataForSchedule}></GoalTreeView>
      <Alert></Alert>
    </>)
}
