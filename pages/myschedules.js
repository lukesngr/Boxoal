import SignedInNav from "@/components/nav/SignedInNav";
import { useSession } from "next-auth/react";
import { useQuery, QueryCache } from "react-query";
import axios from "axios";
import NoSchedules from "@/components/schedule/NoSchedules";
import RedirWhenNotAuth from "@/components/RedirWhenNotAuth";
import { createContext } from "react";
import SchedulesView from "@/components/schedule/SchedulesView";
import { getDayNumbers } from "@/modules/dateLogic";

export const SessionContext = createContext();
export const RefetchContext = createContext();

function MySchedulesSeperatedForFunctionality(props) {

    let dayNumbers = getDayNumbers();
    let startOfWeek = new Date();
    startOfWeek.setDate(dayNumbers[0].date);
    startOfWeek.setHours(0);
    startOfWeek.setMinutes(0);

    let endOfWeek = new Date()
    endOfWeek.setDate(dayNumbers[6].date+1); //another day as sometimes timeboxes will go into next week
    endOfWeek.setHours(23);
    endOfWeek.setHours(59);
    
    const {status, data, error, refetch} = useQuery({
        queryKey: ["schedules"], 
        queryFn: async () => {
            const response = await axios.post("/api/getSchedules", { userEmail: props.session.user.email, startOfWeek, endOfWeek });
        
            return response;},
        enabled: true})
    
    return (
        <>
            <RedirWhenNotAuth redirectSrc="/signin" status={props.status}>
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
        return <h1>Loading</h1>
    }else if(status === "authenticated"){
        return <MySchedulesSeperatedForFunctionality session={session} status={status}></MySchedulesSeperatedForFunctionality>
    }  
}