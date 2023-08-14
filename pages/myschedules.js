import SignedInNav from "@/components/SignedInNav";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import axios from "axios";
import NoSchedules from "@/components/NoSchedules";
import { useEffect } from "react";

export default function MySchedules() {
    const {data: session} = useSession();
    const router = useRouter();

    if(!session) {
        console.log("");
    }else{
        const {isLoading, isError, data, error, refetch} = useQuery(["schedules"], () => axios.post("/api/getSchedules", {userEmail: session.user.email}))
        return (
            <>
                <SignedInNav user={session.user}></SignedInNav>
                {data && <NoSchedules />}
            </>
        )
    }
}