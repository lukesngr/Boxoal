import { useEffect, useState } from "react";
import SignInCard  from "@/components/login/SignInCard";
import CreateAccountCard from "@/components/login/CreateAccountCard";
import ForgotPasswordCard from "@/components/login/ForgotPasswordCard";
import LandingPage from "@/components/LandingPage";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/router";
import Alert from "@/components/base/Alert";
import Dashboard from "@/components/Dashboard";
import Loading from "@/components/base/Loading";
import { getCurrentUser } from "@aws-amplify/auth";

export default function Home() {

    const router = useRouter();
    const [componentDisplayed, setComponentDisplayed] = useState("landing");
    const [alert, setAlert] = useState({open: false, title: "", message: ""});
    const [user, setUser] = useState(-1);
    async function getLoginInfo() { 
        try {
            let userDetails = await getCurrentUser();
            setUser(userDetails);
        } catch(error) {
            console.log(error);
        }
    }
    useEffect(()=> {
        getLoginInfo();
    }, []);

    if(user != -1) {
        return <Dashboard user={user} />
    }else {
        return (
            <>
                <Alert alert={alert} setAlert={setAlert}/>
                {componentDisplayed == "landing" && <LandingPage setAlert={setAlert} setComponentDisplayed={setComponentDisplayed} />}
                {componentDisplayed == "signIn" && <SignInCard setAlert={setAlert} setComponentDisplayed={setComponentDisplayed} />}
                {componentDisplayed == "createAccount" && <CreateAccountCard setAlert={setAlert} setComponentDisplayed={setComponentDisplayed} />}
                {componentDisplayed == "forgotPassword" && <ForgotPasswordCard setAlert={setAlert} setComponentDisplayed={setComponentDisplayed} />}
        </>)
    }
}