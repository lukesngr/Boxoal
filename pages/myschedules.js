import SignedInNav from "@/components/nav/SignedInNav";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import axios from "axios";
import NoSchedules from "@/components/schedule/NoSchedules";
import RedirWhenNotAuth from "@/components/RedirWhenNotAuth";
import { createContext } from "react";
import SchedulesView from "@/components/schedule/SchedulesView";
import { RefetchContextProvider } from "@/components/base/RefetchContext";

export const SessionContext = createContext();

function MySchedulesSeperatedForFunctionality(props) {
    
    const {status, data, error, refetch} = useQuery(["schedules"], () => axios.post("/api/getSchedules", {userEmail: props.session.user.email}))

    return (
        <>
            <RedirWhenNotAuth redirectSrc="/signin" status={props.status}>
                <SignedInNav session={props.session}></SignedInNav>
                <SessionContext.Provider value={props.session}>
                    <RefetchContext.Provider value={refetch}>
                    {data && data.data.length > 0 ? (<SchedulesView data={data}></SchedulesView>) : (<NoSchedules session={props.session}/>) }
                    </RefetchContext.Provider>
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