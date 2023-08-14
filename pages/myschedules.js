import SignedInNav from "@/components/SignedInNav";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import axios from "axios";
import NoSchedules from "@/components/NoSchedules";
import RedirWhenNotAuth from "@/components/RedirWhenNotAuth";

export default function MySchedules() {
    const {data: session, status} = useSession();
    const {isLoading, isError, data, error, refetch} = useQuery(["schedules"], () => axios.post("/api/getSchedules", {userEmail: session.user.email}))

    return (
        <>
            <RedirWhenNotAuth redirectSrc="/signin" status={status}>
                <SignedInNav session={session}></SignedInNav>
                {data && <NoSchedules session={session}/>}
            </RedirWhenNotAuth>
        </>
    )
}