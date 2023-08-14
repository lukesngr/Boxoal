import SignedInNav from "@/components/SignedInNav";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import axios from "axios";
import NoSchedules from "@/components/NoSchedules";
import RedirWhenNotAuth from "@/components/RedirWhenNotAuth";

export default function MySchedules() {
    const {data: session} = useSession();
    const {isLoading, isError, data, error, refetch} = useQuery(["schedules"], () => axios.post("/api/getSchedules", {userEmail: session.user.email}))

    return (
        <>
            <RedirWhenNotAuth redirectSrc="/signin" session={session}>
                <SignedInNav user={session.user}></SignedInNav>
                {data && <NoSchedules />}
            </RedirWhenNotAuth>
        </>
    )
}