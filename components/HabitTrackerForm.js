import Loading from "./base/Loading";
import axios from "axios";
export default function HabitTrackerForm() {

    const {status, data, error, refetch} = useQuery({
        queryKey: ["habit"], 
        queryFn: async () => {
            const response = await axios.post("/api/getCompletedHabits", { userEmail: props.session.user.email });
            return response;},
        enabled: true})

    if(status === "loading") {
        return <Loading />
    }
    
    return (
        <div className="habitTrackerForm">
            <h5>Habits</h5>
            <p>Use this for simple do or donts that are quick to do</p>
        </div>
        )
}