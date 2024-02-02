import SignedInNav from "@/components/nav/SignedInNav";
import { useSession } from "next-auth/react";
import { useQuery, QueryCache } from "react-query";
import axios from "axios";
import NoSchedules from "@/components/schedule/NoSchedules";
import RedirWhenNotAuth from "@/components/RedirWhenNotAuth";
import { createContext, useContext } from "react";
import SchedulesView from "@/components/schedule/SchedulesView";
import { ScheduleContextProvider, ScheduleContext } from "@/components/schedule/ScheduleContext";
import dayjs from "dayjs";
import Loading from "@/components/base/Loading";

export const SessionContext = createContext();
export const RefetchContext = createContext();

function MySchedulesSeperatedForFunctionality(props) {

    const {selectedSchedule, setSelectedSchedule, expanded, setExpanded, selectedDate, setSelectedDate} = useContext(ScheduleContext);

    let startOfWeek = selectedDate.startOf('week').hour(0).minute(0).toDate();
    let endOfWeek = selectedDate.endOf('week').add(1, 'day').hour(23).minute(59).toDate(); //another day as sometimes timeboxes will go into next week
    
    const {status, data, error, refetch} = useQuery({
        queryKey: ["schedules"], 
        queryFn: async () => {
            const response = await axios.post("/api/getSchedules", { userEmail: props.session.user.email, startOfWeek, endOfWeek });
        
            return response;},
        enabled: true})

    if(status === "loading") {
        return <Loading />
    }
    
    return (
        <>
            <RedirWhenNotAuth redirectSrc="/signin" status={props.status}>
                <div id='portalRoot'></div>
                <SignedInNav session={props.session}></SignedInNav>
                <SessionContext.Provider value={props.session}>
                    {data && data.data.length > 0 ? (<SchedulesView data={data}></SchedulesView>) : (<NoSchedules session={props.session}/>) }
                </SessionContext.Provider>
            </RedirWhenNotAuth>
        </>
    )
}

export default function MySchedules() {
    const {data: session, status} = useSession();

    if(status == "loading") {
        return <Loading />
    }else if(status === "authenticated"){
        return <ScheduleContextProvider><MySchedulesSeperatedForFunctionality session={session} status={status}></MySchedulesSeperatedForFunctionality></ScheduleContextProvider>
    }  
}