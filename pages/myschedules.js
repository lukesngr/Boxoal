import SignedInNav from "@/components/SignedInNav";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import axios from "axios";
import NoSchedules from "@/components/NoSchedules";
import RedirWhenNotAuth from "@/components/RedirWhenNotAuth";

function MySchedulesSeperatedForFunctionality(props) {
    
    const {isLoading, isError, data, error, refetch} = useQuery(["schedules"], () => axios.post("/api/getSchedules", {userEmail: props.session.user.email}))

    return (
        <>
            <RedirWhenNotAuth redirectSrc="/signin" status={props.status}>
                <SignedInNav session={props.session}></SignedInNav>
                {data && <NoSchedules session={props.session}/>}
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