import SignedInNav from "@/components/SignedInNav";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import axios from "axios";

export default function MySchedules() {
    const {data: session} = useSession();
    const router = useRouter();
    const {isLoading, isError, data, error, refetch} = useQuery(["schedules"], () => axios.post("/api/getSchedules", {userEmail: session.user.email}))
    console.log(data)
    
    if(!session) {
        router.push('/signin');
    }else{
        return (
            <>
                <SignedInNav user={session.user}></SignedInNav>
            </>
        )
    }
}