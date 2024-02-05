import Loading from "./base/Loading";
import axios from "axios";
export default function HabitTrackerForm() {
    
    let startOfWeek = selectedDate.startOf('week').toDate();
    let endOfWeek = selectedDate.endOf('week').toDate();

    const {status, data, error, refetch} = useQuery({
        queryKey: ["habit"], 
        queryFn: async () => {
            const response = await axios.post("/api/getCompletedHabits", { userEmail: props.session.user.email, startOfWeek, endOfWeek });
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