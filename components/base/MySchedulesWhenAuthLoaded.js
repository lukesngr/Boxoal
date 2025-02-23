import { useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useDispatch } from "react-redux";
import serverIP from "@/modules/serverIP";
import CreateScheduleForm from "@/components/form/CreateScheduleForm2";
import { useState } from "react";
import Alert from "@/components/base/Alert";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
export default function MySchedulesWhenAuthLoaded({userId}) {
    const dispatch = useDispatch();
    const [alert, setAlert] = useState({open: false, title: "", message: ""});
    useProfile(userId, dispatch);

    const {status, data, error, refetch} = useQuery({
        queryKey: ["schedule"], 
        queryFn: async () => {
            const response = await axios.get(serverIP+"/getSchedules", { params: {
                userUUID: userId
            }});
            return response.data;
        },
        enabled: true
    })

    if(status === 'pending') return <Loading />
    if(status === 'error') return <p>Error: {error.message}</p>

    return (<>
        <Alert alert={alert} setAlert={setAlert}/>
        <CreateScheduleForm open={true} onClose={() => {}} setAlert={setAlert}/>
    </>)
}